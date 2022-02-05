import { z } from 'zod';

import { Operator } from './Operator';
import {
	NumberOrStringArraySchema,
	NumberOrStringSchema,
	NumberRangeSchema,
	NumberSchema
} from './ConditionValues';

const ConditionCommonSchema = z.object({
	path: z.string()
}).strict();

export const ConditionBetweenSchema = ConditionCommonSchema.extend({
	operator: z.literal(Operator.BETWEEN),
	value: NumberRangeSchema
});

export const ConditionEqualSchema = ConditionCommonSchema.extend({
	operator: z.literal(Operator.EQUAL),
	value: NumberOrStringSchema
});

export const ConditionGreaterThanOrEqualSchema = ConditionCommonSchema.extend({
	operator: z.literal(Operator.GREATER_THAN_OR_EQUAL),
	value: NumberSchema
});

export const ConditionInSchema = ConditionCommonSchema.extend({
	operator: z.literal(Operator.IN),
	value: NumberOrStringArraySchema
});

export const ConditionLessThanSchema = ConditionCommonSchema.extend({
	operator: z.literal(Operator.LESS_THAN),
	value: NumberSchema
});

export const ConditionNotEqualSchema = ConditionCommonSchema.extend({
	operator: z.literal(Operator.NOT_EQUAL),
	value: NumberOrStringSchema
});

export const AllConditionsSchema = z.union([
	ConditionBetweenSchema,
	ConditionEqualSchema,
	ConditionGreaterThanOrEqualSchema,
	ConditionInSchema,
	ConditionLessThanSchema,
	ConditionNotEqualSchema
]);

export type ConditionSerialised = z.infer<typeof AllConditionsSchema>;
