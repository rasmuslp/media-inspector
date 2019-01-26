interface FilterConditionOptions {
	path: String,
	value: any // TODO Check this!!
}

export class FilterCondition {
	_options: FilterConditionOptions;

	constructor(options: FilterConditionOptions) {
		this._options = options;
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

	toStringForValue(inputValue) {
		return `${inputValue} ${this.toString()}`;
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
