import { FilterConditionResult } from './FilterConditionResult';
import { FilterCondition } from './FilterCondition';

export class FilterConditionLt extends FilterCondition {
	check(inputValue) {
		// Convert the input
		const value = FilterConditionLt.convertValue(inputValue);

		// Check condition
		if (value < this.expectedValue) {
			return new FilterConditionResult(this, value, true);
		}

		return new FilterConditionResult(this, value, false);
	}

	toString() {
		return `< ${this.expectedValue}`;
	}
}
