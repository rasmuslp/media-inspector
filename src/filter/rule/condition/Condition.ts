import * as t from 'io-ts';

import { ConditionResult } from './ConditionResult';
import { ConditionOperatorValidator } from './ConditionOperator';

export const TCondition = t.type({
	path: t.string,
	operator: ConditionOperatorValidator
});
export type ConditionData = t.TypeOf<typeof TCondition>;

export type ConditionConvertedValueType = number|string;

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

	static convertValue(value: unknown): ConditionConvertedValueType {
		if (!isNaN(Number(value))) {
			return Number(value);
		}

		if (typeof value === 'string') {
			return value.toLocaleLowerCase();
		}

		return value.toString();
	}
}
