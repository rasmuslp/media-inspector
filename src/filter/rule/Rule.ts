import debug from 'debug';
import * as t from 'io-ts';

import { RuleResult } from './RuleResult';
import { Condition, TCondition } from './condition/Condition';
import { RuleTypeValidator } from './RuleType';

const debugLog = debug('Rule');

export const TRule = t.type({
	mimeType: t.string,
	type: RuleTypeValidator,
	conditions: t.array(TCondition)
});

export type RuleData = t.TypeOf<typeof TRule>;

export class Rule {
	_mimeType: string;
	_conditions: Condition[];

	constructor(mimeType: string, conditions: Condition[] = []) {
		this._mimeType = mimeType;
		this._conditions = conditions;
	}

	get mimeType(): string {
		return this._mimeType;
	}

	checkRuleWithPathGetter(pathGetterFn: Function): RuleResult|null {
		// All conditions must be met
		const conditionResults = [];
		for (const condition of this._conditions) {
			// Try to read value
			let value;
			try {
				value = pathGetterFn(condition.path);
			}
			catch (e) {
				// TODO: Log better with verbose, perhaps have a strict mode of some kind?
				// I assume, that currently 'audio.channels < 2' wont fail, if there is no 'channels' (although it probably will fail if there isn't an audio track)
				debugLog(`Could not read ${condition.path} from ${condition.path}`, e.message || e);
				continue;
			}

			// Check and store
			const conditionResult = condition.check(value);
			conditionResults.push(conditionResult);
		}

		if (conditionResults.length) {
			return new RuleResult(conditionResults);
		}

		return null;
	}
}
