const FilterConditionResult = require('./FilterConditionResult');

class FilterCondition {
	constructor({ path, comparator, value }) {
		this._path = path;
		this._comparator = comparator;
		this._expectedValue = value;
	}

	get path() {
		return this._path;
	}

	get pathParts() {
		return this._path.split('.');
	}

	check(value) {
		// Default result is a pass
		let result = new FilterConditionResult({
			filterCondition: this,
			conditionStringified: `${this._comparator} ${this._expectedValue}`,
			value,
			passed: true
		});

		// Test value
		switch (this._comparator) {
			case 'string': {
				if (!(value.toLocaleLowerCase() === this._expectedValue.toLocaleLowerCase())) {
					result = new FilterConditionResult({
						filterCondition: this,
						conditionStringified: `${this._comparator} ${this._expectedValue.toLocaleLowerCase()}`,
						value: `${value.toLocaleLowerCase()}`,
						passed: false
					});
				}

				break;
			}
			case '>=': {
				if (!(value >= this._expectedValue)) {
					result = new FilterConditionResult({
						filterCondition: this,
						conditionStringified: `${this._comparator} ${this._expectedValue}`,
						value,
						passed: false
					});
				}

				break;
			}

			default:
				// Let it pass: Unknown comparator? We count that as a pass
				console.error(`Unknown comparator '${this._comparator}' in condition`, this);
		}

		return result;
	}
}

module.exports = FilterCondition;
