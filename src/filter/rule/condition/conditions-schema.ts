import { z } from 'zod';

import { OperatorType } from './OperatorType';
import {
	NumberOrStringArraySchema,
	NumberOrStringSchema,
	NumberRangeSchema,
	NumberSchema
} from './ConditionValues';

export const OperatorTypeSchema = z.nativeEnum(OperatorType);

export const ConditionSchema = z.object({
	path: z.string(),
	operator: OperatorTypeSchema,
	value: z.any()
});

export type ConditionSerialised = z.infer<typeof ConditionSchema>;

export const ConditionBetweenSchema = ConditionSchema.extend({
	value: NumberRangeSchema
});

export const ConditionEqualSchema = ConditionSchema.extend({
	value: NumberOrStringSchema
});

export const ConditionGreaterThanOrEqualSchema = ConditionSchema.extend({
	value: NumberSchema
});

export const ConditionInSchema = ConditionSchema.extend({
	value: NumberOrStringArraySchema
});

export const ConditionLessThanSchema = ConditionSchema.extend({
	value: NumberSchema
});

export const ConditionNotEqualSchema = ConditionSchema.extend({
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
