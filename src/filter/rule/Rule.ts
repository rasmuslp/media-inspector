import createDebug from 'debug';
import * as t from 'io-ts';

import { RuleResult } from './RuleResult';
import { Condition } from './condition/Condition';
import { RuleTypeValidator } from './RuleType';
import { TConditionBetween } from './condition/operators/ConditionBetween';
import { TConditionEqual } from './condition/operators/ConditionEqual';
import { TConditionGreaterThanOrEqual } from './condition/operators/ConditionGreaterThanOrEqual';
import { TConditionIn } from './condition/operators/ConditionIn';
import { TConditionLessThan } from './condition/operators/ConditionLessThan';
import { TConditionNotEqual } from './condition/operators/ConditionNotEqual';

const debug = createDebug('Rule');

const TAllConditionOperators = t.union([
	TConditionBetween,
	TConditionEqual,
	TConditionGreaterThanOrEqual,
	TConditionIn,
	TConditionLessThan,
	TConditionNotEqual
]);

export const TRule = t.type({
	mimeType: t.string,
	type: RuleTypeValidator,
	conditions: t.array(TAllConditionOperators)
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

	checkRuleWithPathGetter(pathGetterFn: (string) => string): RuleResult|undefined {
		// All conditions must be met
		const conditionResults = [];
		for (const condition of this._conditions) {
			// Try to read value
			let value;
			try {
				value = pathGetterFn(condition.path);
			}
			catch (error) {
				// TODO: Log better with verbose, perhaps have a strict mode of some kind?
				// I assume, that currently 'audio.channels < 2' wont fail, if there is no 'channels' (although it probably will fail if there isn't an audio track)
				debug(`Could not read ${condition.path} from ${condition.path}`, (error as Error).message || error);
				continue;
			}

			// Check and store
			const conditionResult = condition.check(value);
			conditionResults.push(conditionResult);
		}

		if (conditionResults.length > 0) {
			return new RuleResult(conditionResults);
		}
	}
}
