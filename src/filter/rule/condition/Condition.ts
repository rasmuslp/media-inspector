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

	static convertValue(value: any) {
		if (Array.isArray(value)) {
			// @ts-ignore
			const numbers = value.filter(v => !isNaN(Number(v.toString())));
			if (value.length === numbers.length) {
				// @ts-ignore
				return value.map(v => Number(v.toString()));
			}

			// @ts-ignore
			const strings = value.filter(v => typeof v === 'string');
			if (value.length === strings.length) {
				// @ts-ignore
				return value.map(v => v.toLocaleLowerCase());
			}

			return value.map(v => v.toString());
		}

		if (!isNaN(Number(value.toString()))) {
			return Number(value.toString());
		}

		if (typeof value === 'string') {
			return value.toLocaleLowerCase();
		}

		return value.toString();
	}
}
