import { Condition } from '../Condition';
import { ConditionResult } from '../ConditionResult';

export abstract class Operator<T = unknown> implements Condition {
	readonly path: string;
	readonly value: T;

	constructor(path: string, value: T) {
		this.path = path;
		this.value = value;
	}

	abstract check(inputValue: string): ConditionResult;

	abstract toStringForValue(inputValue: number|string): string;

	static convertValue(value: unknown): number|string {
		if (!Number.isNaN(Number(value))) {
			return Number(value);
		}

		if (typeof value === 'string') {
			return value.toLocaleLowerCase();
		}

		return value.toString();
	}
}
