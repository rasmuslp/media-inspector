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

	cccheck(value) {
		// Default result is a pass
		let result = null;

		// Test value
		switch (this._comparator) {
			case 'string': {
				if (!(value.toLocaleLowerCase() === this._expectedValue.toLocaleLowerCase())) {
					result = {
						path: this._path,
						condition: `${this._comparator} ${this._expectedValue.toLocaleLowerCase()}`,
						value: `${value.toLocaleLowerCase()}`
					};
				}

				break;
			}
			case '>=': {
				if (!(value >= this._expectedValue)) {
					// We didn't meet the condition
					result = {
						path: this._path,
						condition: `${this._comparator} ${this._expectedValue}`,
						value
					};
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
