const FilterConditionResult = require('./FilterConditionResult');

class FilterCondition {
	constructor({ comparator, operator, path, value }) {
		this._options = {
			operator: operator || comparator,
			path,
			value
		};

		if (comparator) {
			console.log(`[FilterCondition] The 'comparator' option is deprecated. Use 'operator' instead.`);
		}

		// Check operator exists
		if (!this.constructor.getAvailableOperators().includes(this._options.operator)) {
			throw new Error(`Unknown operator '${this._options.operator}' in ${JSON.stringify(this._options)}`);
		}
	}

	get operator() {
		return this._options.operator;
	}

	get expectedValue() {
		return this.constructor.convertValue(this._options.value);
	}

	get path() {
		return this._options.path;
	}

	get pathParts() {
		return this.path.split('.');
	}

	toString() {
		return `${this.operator} ${this.expectedValue}`;
	}

	static getAvailableOperators() {
		const operators = [
			'in',
			'string',
			'=',
			'>='
		];

		return operators;
	}

	static convertValue(inputValue) {
		let value = inputValue;

		// Try to convert / transform the input here
		// eslint-disable-next-line default-case
		switch (typeof inputValue) {
			case 'number': {
				// Try parsing to Number
				const num = Number(inputValue);
				if (!isNaN(num)) {
					value = num;
				}

				break;
			}

			case 'string': {
				value = inputValue.toLocaleLowerCase();

				break;
			}
		}

		return value;
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

		// Test value
		switch (this.operator) {
			case 'in': {
				if (!Array.isArray(this.expectedValue)) {
					console.error(`[FilterCondition] The 'in' operator expects an array, not '${this.expectedValue}'`, this._options);

					break;
				}

				// Supports both string and number comparison
				const pass = this.expectedValue.find(expected => this.constructor.convertValue(expected) === value);
				if (pass) {
					result.passed = true;
				}

				break;
			}

			case 'string': {
				console.log(`[FilterCondition] The 'string' operator is deprecated. Use '=' instead.`);
			}

			// falls through

			case '=': {
				if (value === this.expectedValue) {
					result.passed = true;
				}

				break;
			}

			case '>=': {
				if (value >= this.expectedValue) {
					result.passed = true;
				}

				break;
			}

			default:
				throw new Error(`Unknown operator '${this._options.operator}' in ${JSON.stringify(this._options)}`);
		}

		return result;
	}
}

module.exports = FilterCondition;
