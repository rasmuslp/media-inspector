const FilterConditionResult = require('../FilterConditionResult');

const FilterCondition = require('./FilterCondition');

class FilterConditionBetween extends FilterCondition {
	constructor(options) {
		super(options);

		if (!Array.isArray(this.expectedValue)) {
			throw new Error(`The 'between' operator expects an array of 2 values, not '${this.expectedValue}'. ${JSON.stringify(options)}`);
		}
	}

	check(inputValue) {
		// Convert the input
		let value = this.constructor.convertValue(inputValue);

		// Default result is a failure
		let result = new FilterConditionResult({
			filterCondition: this,
			value,
			passed: false
		});

		// Check condition
		if (this.expectedValue[0] <= value && value <= this.expectedValue[1]) {
			result.passed = true;
		}

		return result;
	}

	toString() {
		return `${this.expectedValue[0]} <= X <= ${this.expectedValue[1]}`;
	}

	toStringForValue(inputValue) {
		return `${this.expectedValue[0]} <= ${inputValue} <= ${this.expectedValue[1]}`;
	}
}

module.exports = FilterConditionBetween;
