import crypto from 'crypto';

import { FilterConditionBetween } from './FilterConditionBetween';
import { FilterConditionEq } from './FilterConditionEq';
import { FilterConditionGe } from './FilterConditionGe';
import { FilterConditionIn } from './FilterConditionIn';
import { FilterConditionLt } from './FilterConditionLt';
import { FilterConditionNe } from './FilterConditionNe';

export interface FilterConditionData {
	path: string;
	operator: string; // TODO: enum
	value;
}

export class FilterConditionFactory {
	static _filterConditions = new Map();

	static createFilterCondition(inputCondition: FilterConditionData) {
		const condition = Object.assign({}, inputCondition);

		// Create and return
		switch (condition.operator) {
			case 'between':
				return new FilterConditionBetween(condition.path, condition.value);

			case 'in':
				return new FilterConditionIn(condition.path, condition.value);

			case '=':
				return new FilterConditionEq(condition.path, condition.value);

			case '!=':
				return new FilterConditionNe(condition.path, condition.value);

			case '<':
				return new FilterConditionLt(condition.path, condition.value);

			case '>=':
				return new FilterConditionGe(condition.path, condition.value);

			default:
				throw new Error(`Unknown operator '${condition.operator}' in ${JSON.stringify(inputCondition)}`);
		}
	}

	static getFilterCondition(condition: FilterConditionData) {
		// Calculate hash of input
		const hash = crypto.createHash('md5').update(JSON.stringify(condition)).digest('hex');

		// Check if already available
		if (FilterConditionFactory._filterConditions.has(hash)) {
			return FilterConditionFactory._filterConditions.get(hash);
		}

		// Otherwise create and store for future reuse
		const filterCondition = FilterConditionFactory.createFilterCondition(condition);
		FilterConditionFactory._filterConditions.set(hash, filterCondition);

		return filterCondition;
	}
}
