const FilterConditionResult = require('../FilterConditionResult');

const FilterCondition = require('./FilterCondition');

class FilterConditionIn extends FilterCondition {
	constructor(options) {
		super(options);

		if (!Array.isArray(this.expectedValue)) {
			throw new Error(`The 'in' operator expects an array, not '${this.expectedValue}'. ${JSON.stringify(options)}`);
		}
	}

	check(inputValue) {
		// Convert the input
		let value = FilterConditionIn.convertValue(inputValue);

		// Default result is a failure
		let result = new FilterConditionResult({
			filterCondition: this,
			value,
			passed: false
		});

		// Supports both string and number comparison
		const pass = this.expectedValue.find(expected => FilterConditionIn.convertValue(expected) === value);
		if (pass) {
			result.passed = true;
		}

		return result;
	}

	toString() {
		return `in [${this.expectedValue.join(', ')}]`;
	}
}

module.exports = FilterConditionIn;
