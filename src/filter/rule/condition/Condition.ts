import { z } from 'zod';

import { ConditionOperatorSchema } from './ConditionOperator';
import { ConditionResult } from './ConditionResult';

export const ConditionSchema = z.object({
	path: z.string(),
	operator: ConditionOperatorSchema,
	value: z.any()
});
export type ConditionSerialised = z.infer<typeof ConditionSchema>;

export abstract class Condition<T = unknown> {
	readonly path: string;
	readonly value: T;

	constructor(path: string, value: T) {
		this.path = path;
		this.value = value;
	}

	abstract toString(): string

	toStringForValue(inputValue: string): string {
		return `${inputValue} ${this.toString()}`;
	}

	abstract check(inputValue: string): ConditionResult;

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
