import { FilterCondition } from '../filter-condition/FilterCondition';
import { FilterRule, FilterRuleData } from './FilterRule';
import { FilterConditionData } from '../filter-condition/FilterConditionFactory';
import { FilterMetadataRuleResult } from './FilterMetadataRuleResult';

const debug = require('debug')('FilterMetadataRule');

export interface FilterMetadataRuleData extends FilterRuleData {
	conditions: FilterConditionData[];
}

export class FilterMetadataRule extends FilterRule {
	_conditions: FilterCondition[];

	constructor(mimeType: string, conditions: FilterCondition[] = []) {
		super(mimeType);
		this._conditions = conditions;
	}

	checkRuleWithPathGetter(pathGetterFn: Function): FilterMetadataRuleResult {
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
				debug(`Could not read ${filterCondition.path} from ${filterCondition.path}`, e.message || e);
				continue;
			}

			// Check and store
			const filterConditionResult = filterCondition.check(value);
			results.push(filterConditionResult);
		}

		return new FilterMetadataRuleResult(results);
	}
}
