import { FilterCondition } from './FilterCondition';
import { FilterConditionSatisfied } from './filter-condition-result/FilterConditionSatisfied';
import { FilterConditionFailed } from './filter-condition-result/FilterConditionFailed';

export class FilterConditionNe extends FilterCondition {
	check(inputValue) {
		// Convert the input
		const value = FilterConditionNe.convertValue(inputValue);

		// Check condition
		if (value !== this.expectedValue) {
			return new FilterConditionSatisfied(this, value);
		}

		return new FilterConditionFailed(this, value);
	}

	toString() {
		return `= ${this.expectedValue}`;
	}
}
