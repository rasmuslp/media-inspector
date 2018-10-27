const FilterConditionResult = require('./FilterConditionResult');

class FilterCondition {
	constructor({ comparator, operator, path, value }) {
		this._options = {
			operator: operator || comparator,
			path,
			value
		};
	}

	get operator() {
		return this._options.operator;
	}

	get expectedValue() {
		return this._options.value;
	}

	get path() {
		return this._options.path;
	}

	get pathParts() {
		return this.path.split('.');
	}

	static convertInput(inputValue) {
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
		let value = this.constructor.convertInput(inputValue);

		// Default result is a pass
		let result = new FilterConditionResult({
			filterCondition: this,
			conditionStringified: `${this.operator} ${this.expectedValue}`,
			value,
			passed: true
		});

		// Test value
		switch (this.operator) {
			case 'string': {
				if (!(value.toLocaleLowerCase() === this.expectedValue.toLocaleLowerCase())) {
					result = new FilterConditionResult({
						filterCondition: this,
						conditionStringified: `${this.operator} ${this.expectedValue.toLocaleLowerCase()}`,
						value: `${value.toLocaleLowerCase()}`,
						passed: false
					});
				}

				break;
			}

			case '>=': {
				if (!(value >= this.expectedValue)) {
					result = new FilterConditionResult({
						filterCondition: this,
						conditionStringified: `${this.operator} ${this.expectedValue}`,
						value,
						passed: false
					});
				}

				break;
			}

			default:
				// Let it pass: Unknown operator? We count that as a pass
				// TODO: Throw error here, when it is "unreachable" - i.e. after condition validation is implemented
				console.error(`Unknown operator '${this.operator}' in condition`, this._options);
		}

		return result;
	}
}

module.exports = FilterCondition;
