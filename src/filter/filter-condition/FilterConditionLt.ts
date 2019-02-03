import { FilterConditionResult } from './FilterConditionResult';
import { FilterCondition } from './FilterCondition';

export class FilterConditionLt extends FilterCondition {
	check(inputValue) {
		// Convert the input
		let value = FilterConditionLt.convertValue(inputValue);

		// Default result is a failure
		let result = new FilterConditionResult({
			filterCondition: this,
			value,
			passed: false
		});

		// Check condition
		if (value < this.expectedValue) {
			result.passed = true;
		}

		return result;
	}

	toString() {
		return `< ${this.expectedValue}`;
	}
}
