import { z } from 'zod';

export enum ConditionOperator {
	BETWEEN = 'between',
	IN = 'in',
	EQUAL = '=',
	NOT_EQUAL = '!=',
	LESS_THAN = '<',
	GREATER_THAN_OR_EQUAL = '>='
}

export const ConditionOperatorSchema = z.nativeEnum(ConditionOperator);
