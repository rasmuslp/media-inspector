import { RuleResult } from './RuleResult';
import { ConditionData } from './condition/ConditionFactory';
import { Condition } from './condition/Condition';

const debug = require('debug')('Rule');

export interface RuleData {
	mimeType: string;
	type: RuleType;
	conditions: ConditionData[];
}

export enum RuleType {
	DEFAULT = 'default',
	SEASON_SIZE_DISCREPANCY = 'season-size-discrepancy'
}

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

	checkRuleWithPathGetter(pathGetterFn: Function): RuleResult {
		// All conditions must be met
		const results = [];
		for (const condition of this._conditions) {
			// Try to read value
			let value;
			try {
				value = pathGetterFn(condition.path);
			}
			catch (e) {
				// Swallow: Could not get property? Ee count that as a pass
				// TODO: Log better with verbose, perhaps have a strict mode of some kind?
				// I assume, that currently 'audio.channels < 2' wont fail, if there is no 'channels' (although it probably will fail if there isn't an audio track)
				debug(`Could not read ${condition.path} from ${condition.path}`, e.message || e);
				continue;
			}

			// Check and store
			const conditionResult = condition.check(value);
			results.push(conditionResult);
		}

		return new RuleResult(results);
	}
}
