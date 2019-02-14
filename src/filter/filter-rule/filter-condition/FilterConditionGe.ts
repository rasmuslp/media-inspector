import { FilterCondition } from './FilterCondition';
import { FilterConditionSatisfied } from './filter-condition-result/FilterConditionSatisfied';
import { FilterConditionFailed } from './filter-condition-result/FilterConditionFailed';

export class FilterConditionGe extends FilterCondition {
	check(inputValue) {
		// Convert the input
		const value = FilterConditionGe.convertValue(inputValue);

		// Check condition
		if (value >= this.expectedValue) {
			return new FilterConditionSatisfied(this, value);
		}

		return new FilterConditionFailed(this, value);
	}

	toString() {
		return `>= ${this.expectedValue}`;
	}
}
