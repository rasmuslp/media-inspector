import * as t from 'io-ts';

import { ConditionResult } from './ConditionResult';
import { ConditionOperatorValidator } from './ConditionOperator';

export const ConditionDataValidator = t.type({
	path: t.string,
	operator: ConditionOperatorValidator,
	value: t.unknown
});

export type ConditionData = t.TypeOf<typeof ConditionDataValidator>;

export type ConditionValueType = number|string|number[]|string[];

export abstract class Condition {
	_path: string;
	_value;

	constructor(path: string, value) {
		this._path = path;
		this._value = value;
	}

	get expectedValue(): ConditionValueType {
		return Condition.convertValue(this._value);
	}

	get path(): string {
		return this._path;
	}

	get pathParts(): string[] {
		return this.path.split('.');
	}

	abstract toString()

	toStringForValue(inputValue): string {
		return `${inputValue} ${this.toString()}`;
	}

	abstract check(inputValue): ConditionResult;

	static convertValue(value): ConditionValueType {
		if (Array.isArray(value)) {
			const numbers = value.filter(v => !isNaN(Number(v.toString())));
			if (value.length === numbers.length) {
				return value.map(v => Number(v.toString()));
			}

			const strings = value.filter(v => typeof v === 'string');
			if (value.length === strings.length) {
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
