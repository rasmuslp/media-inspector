import { z } from 'zod';

import { OperatorTypeSchema } from './OperatorType';

export const ConditionSchema = z.object({
	path: z.string(),
	operator: OperatorTypeSchema,
	value: z.any()
});
export type ConditionSerialised = z.infer<typeof ConditionSchema>;

export interface Condition<T = unknown> {
	path: string;
	value: T;

	check(inputValue: number | string): boolean;

	toStringForValue(inputValue: number | string): string;
}
