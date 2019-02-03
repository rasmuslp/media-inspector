import { FilterConditionResult } from './FilterConditionResult';
import { FilterCondition } from './FilterCondition';

export class FilterConditionIn extends FilterCondition {
	constructor(options) {
		super(options);

		if (!Array.isArray(this.expectedValue)) {
			throw new Error(`The 'in' operator expects an array, not '${this.expectedValue}'. ${JSON.stringify(options)}`);
		}
	}

	check(inputValue) {
		// Convert the input
		const value = FilterConditionIn.convertValue(inputValue);

		// Supports both string and number comparison
		const match = this.expectedValue.find(expected => FilterConditionIn.convertValue(expected) === value);
		if (match) {
			return new FilterConditionResult(this, value, true);
		}

		return new FilterConditionResult(this, value, false);
	}

	toString() {
		return `in [${this.expectedValue.join(', ')}]`;
	}
}
