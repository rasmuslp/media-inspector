const FilterConditionResult = require('./FilterConditionResult');

class FilterCondition {
	constructor({ comparator, path, value }) {
		this._options = {
			comparator,
			path,
			value
		};
	}

	get comparator() {
		return this._options.comparator;
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

	check(value) {
		// Default result is a pass
		let result = new FilterConditionResult({
			filterCondition: this,
			conditionStringified: `${this.comparator} ${this.expectedValue}`,
			value,
			passed: true
		});

		// Test value
		switch (this.comparator) {
			case 'string': {
				if (!(value.toLocaleLowerCase() === this.expectedValue.toLocaleLowerCase())) {
					result = new FilterConditionResult({
						filterCondition: this,
						conditionStringified: `${this.comparator} ${this.expectedValue.toLocaleLowerCase()}`,
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
						conditionStringified: `${this.comparator} ${this.expectedValue}`,
						value,
						passed: false
					});
				}

				break;
			}

			default:
				// Let it pass: Unknown comparator? We count that as a pass
				// TODO: Throw error here, when it is "unreachable" - i.e. after condition validation is implemented
				console.error(`Unknown comparator '${this.comparator}' in condition`, this._options);
		}

		return result;
	}
}

module.exports = FilterCondition;
