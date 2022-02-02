import { z } from 'zod';

import { Operator } from './Operator';
import {
	AllConditionsValuesSchema,
	NumberOrStringArraySchema,
	NumberOrStringSchema,
	NumberRangeSchema,
	NumberSchema
} from './ConditionValues';

const OperatorSchema = z.nativeEnum(Operator);

const ConditionCommonSchema = z.object({
	path: z.string(),
	operator: OperatorSchema,
	value: AllConditionsValuesSchema
}).strict();

export type ConditionSerialised = z.infer<typeof ConditionCommonSchema>;

export const ConditionBetweenSchema = ConditionCommonSchema.extend({
	value: NumberRangeSchema
}).strict();

export const ConditionEqualSchema = ConditionCommonSchema.extend({
	value: NumberOrStringSchema
}).strict();

export const ConditionGreaterThanOrEqualSchema = ConditionCommonSchema.extend({
	value: NumberSchema
}).strict();

export const ConditionInSchema = ConditionCommonSchema.extend({
	value: NumberOrStringArraySchema
}).strict();

export const ConditionLessThanSchema = ConditionCommonSchema.extend({
	value: NumberSchema
}).strict();

export const ConditionNotEqualSchema = ConditionCommonSchema.extend({
	value: NumberOrStringSchema
}).strict();

export const AllConditionsSchema = z.union([
	ConditionBetweenSchema,
	ConditionEqualSchema,
	ConditionGreaterThanOrEqualSchema,
	ConditionInSchema,
	ConditionLessThanSchema,
	ConditionNotEqualSchema
]);
