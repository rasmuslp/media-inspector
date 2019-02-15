import { ConditionResult } from './condition-result/ConditionResult';

export abstract class Condition {
	_path: string;
	_value;

	constructor(path: string, value) {
		this._path = path;
		this._value = value;
	}

	get expectedValue() {
		return Condition.convertValue(this._value);
	}

	get path() {
		return this._path;
	}

	get pathParts() {
		return this.path.split('.');
	}

	abstract toString()

	toStringForValue(inputValue) {
		return `${inputValue} ${this.toString()}`;
	}

	abstract check(inputValue): ConditionResult;

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
