const FilterConditionResult = require('../FilterConditionResult');

const FilterCondition = require('./FilterCondition');

class FilterConditionIn extends FilterCondition {
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
		if (!Array.isArray(this.expectedValue)) {
			console.error(`[FilterCondition] The 'in' operator expects an array, not '${this.expectedValue}'`, this._options);

			return result;
		}

		// Supports both string and number comparison
		const pass = this.expectedValue.find(expected => this.constructor.convertValue(expected) === value);
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
