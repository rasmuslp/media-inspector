import { z } from 'zod';

export const NumberSchema = z.number();
export type TNumber = z.infer<typeof NumberSchema>;

export const NumberOrStringSchema = z.union([z.number(), z.string()]);
export type TNumberOrString = z.infer<typeof NumberOrStringSchema>;

export const NumberRangeSchema = z.tuple([z.number(), z.number()]);
export type TNumberRange = z.infer<typeof NumberRangeSchema>;

export const NumberOrStringArraySchema = z.array(z.union([z.number(), z.string()]));
export type TNumberOrStringArray = z.infer<typeof NumberOrStringArraySchema>;

export const AllConditionsValuesSchema = z.union([
	NumberSchema,
	NumberOrStringSchema,
	NumberRangeSchema,
	NumberOrStringArraySchema
]);
