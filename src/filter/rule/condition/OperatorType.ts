import { z } from 'zod';

export enum OperatorType {
	BETWEEN = 'between',
	IN = 'in',
	EQUAL = '=',
	NOT_EQUAL = '!=',
	LESS_THAN = '<',
	GREATER_THAN_OR_EQUAL = '>='
}

export const OperatorTypeSchema = z.nativeEnum(OperatorType);
