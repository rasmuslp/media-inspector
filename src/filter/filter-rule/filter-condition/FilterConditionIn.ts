import { FilterCondition } from './FilterCondition';
import { FilterConditionSatisfied } from './filter-condition-result/FilterConditionSatisfied';
import { FilterConditionFailed } from './filter-condition-result/FilterConditionFailed';

export class FilterConditionIn extends FilterCondition {
	constructor(path: string, value) {
		super(path, value);

		if (!Array.isArray(this.expectedValue)) {
			throw new Error(`The 'in' operator expects an array, not '${this.expectedValue}'. Path: ${path} Value: ${value}`);
		}
	}

	check(inputValue) {
		// Convert the input
		const value = FilterConditionIn.convertValue(inputValue);

		// Supports both string and number comparison
		const match = this.expectedValue.find(expected => FilterConditionIn.convertValue(expected) === value);
		if (match) {
			return new FilterConditionSatisfied(this, value);
		}

		return new FilterConditionFailed(this, value);
	}

	toString() {
		return `in [${this.expectedValue.join(', ')}]`;
	}
}
