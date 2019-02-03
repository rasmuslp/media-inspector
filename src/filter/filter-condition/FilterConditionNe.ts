import { FilterConditionResult } from './FilterConditionResult';
import { FilterCondition } from './FilterCondition';

export class FilterConditionNe extends FilterCondition {
	check(inputValue) {
		// Convert the input
		let value = FilterConditionNe.convertValue(inputValue);

		// Default result is a failure
		let result = new FilterConditionResult({
			filterCondition: this,
			value,
			passed: false
		});

		// Check condition
		if (value !== this.expectedValue) {
			result.passed = true;
		}

		return result;
	}

	toString() {
		return `= ${this.expectedValue}`;
	}
}
