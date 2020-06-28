import * as t from 'io-ts';

import { ConditionResult } from './ConditionResult';
import { ConditionOperatorValidator } from './ConditionOperator';

export const TCondition = t.type({
	path: t.string,
	operator: ConditionOperatorValidator
});
export type ConditionData = t.TypeOf<typeof TCondition>;

export type ConditionValueType = number|string|number[]|string[];

export abstract class Condition<T = any> {
	readonly path: string;
	readonly value: T;

	constructor(path: string, value: T) {
		this.path = path;
		this.value = value;
	}

	get pathParts(): string[] {
		return this.path.split('.');
	}

	abstract toString(): string

	toStringForValue(inputValue: string): string {
		return `${inputValue} ${this.toString()}`;
	}

	abstract check(inputValue: string): ConditionResult;

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
