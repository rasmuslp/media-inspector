import { z } from 'zod';

import { ConditionOperatorSchema } from './ConditionOperator';
import { ConditionResult } from './ConditionResult';

export const ConditionSchema = z.object({
	path: z.string(),
	operator: ConditionOperatorSchema,
	value: z.any()
});
export type ConditionSerialised = z.infer<typeof ConditionSchema>;

const ConvertedValueSchema = z.union([z.number(), z.string()]);
type ConvertedValue = z.infer<typeof ConvertedValueSchema>;

export abstract class Condition<T = unknown> {
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

	static convertValue(value: unknown): ConvertedValue {
		if (!Number.isNaN(Number(value))) {
			return Number(value);
		}

		if (typeof value === 'string') {
			return value.toLocaleLowerCase();
		}

		return value.toString();
	}
}
