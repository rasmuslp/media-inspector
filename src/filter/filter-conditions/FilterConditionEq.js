const FilterConditionResult = require('../FilterConditionResult');

const FilterCondition = require('./FilterCondition');

class FilterConditionEq extends FilterCondition {
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
		if (value === this.expectedValue) {
			result.passed = true;
		}

		return result;
	}

	toString() {
		return `= ${this.expectedValue}`;
	}
}

module.exports = FilterConditionEq;
