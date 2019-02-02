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
		if (!isNaN(Number(inputValue.toString()))) {
			return Number(inputValue.toString());
		}

		if (typeof inputValue === 'string') {
			return inputValue.toLocaleLowerCase();
		}

		return inputValue;
	}
}
