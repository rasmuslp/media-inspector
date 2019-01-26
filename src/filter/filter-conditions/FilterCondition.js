class FilterCondition {
	constructor({ path, value }) {
		this._options = {
			path,
			value
		};
	}

	get expectedValue() {
		return FilterCondition.convertValue(this._options.value);
	}

	get path() {
		return this._options.path;
	}

	get pathParts() {
		return this.path.split('.');
	}

	toString() {
		throw new Error('Override this!');
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
}

module.exports = FilterCondition;
