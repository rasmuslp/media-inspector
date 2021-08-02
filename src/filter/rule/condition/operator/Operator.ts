import { Condition } from '../Condition';

export abstract class Operator<T = unknown> implements Condition {
	readonly path: string;

	readonly value: T;

	constructor(path: string, value: T) {
		this.path = path;
		this.value = value;
	}

	abstract check(inputValue: number | string): boolean;

	abstract toStringForValue(inputValue: number | string): string;
}
