import {FilterConditionResult} from './FilterConditionResult';

interface FilterConditionOptions {
	path: String,
	value: boolean | number | string
}

export abstract class FilterCondition {
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

	abstract toString()

	toStringForValue(inputValue) {
		return `${inputValue} ${this.toString()}`;
	}

	abstract check(inputValue): FilterConditionResult;

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
