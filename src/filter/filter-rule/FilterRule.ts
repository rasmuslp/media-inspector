import { FilterRuleResult } from './FilterRuleResult';
import { FilterConditionData } from './filter-condition/FilterConditionFactory';
import { FilterCondition } from './filter-condition/FilterCondition';

const debug = require('debug')('FilterRule');

export interface FilterRuleData {
	mimeType: string;
	type: FilterRuleType;
	conditions: FilterConditionData[];
}

export enum FilterRuleType {
	DEFAULT = 'default',
	SEASON_SIZE_DISCREPANCY = 'season-size-discrepancy'
}

export class FilterRule {
	_mimeType: string;
	_conditions: FilterCondition[];

	constructor(mimeType: string, conditions: FilterCondition[] = []) {
		this._mimeType = mimeType;
		this._conditions = conditions;
	}

	get mimeType() {
		return this._mimeType;
	}

	checkRuleWithPathGetter(pathGetterFn: Function): FilterRuleResult {
		// All conditions must be met
		const results = [];
		for (const filterCondition of this._conditions) {
			// Try to read value
			let value;
			try {
				value = pathGetterFn(filterCondition.path);
			}
			catch (e) {
				// Swallow: Could not get property? Ee count that as a pass
				// TODO: Log better with verbose, perhaps have a strict mode of some kind?
				// I assume, that currently 'audio.channels < 2' wont fail, if there is no 'channels' (although it probably will fail if there isn't an audio track)
				debug(`Could not read ${filterCondition.path} from ${filterCondition.path}`, e.message || e);
				continue;
			}

			// Check and store
			const filterConditionResult = filterCondition.check(value);
			results.push(filterConditionResult);
		}

		return new FilterRuleResult(results);
	}
}
