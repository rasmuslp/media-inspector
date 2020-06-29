import * as t from 'io-ts';

export enum ConditionOperator {
	BETWEEN = 'between',
	IN = 'in',
	EQUAL = '=',
	NOT_EQUAL = '!=',
	LESS_THAN = '<',
	GREATER_THAN_OR_EQUAL = '>='
}

export const ConditionOperatorValidator = t.keyof({ // using "keyof" for better performance instead of "union"
	[ConditionOperator.BETWEEN]: undefined,
	[ConditionOperator.IN]: undefined,
	[ConditionOperator.EQUAL]: undefined,
	[ConditionOperator.NOT_EQUAL]: undefined,
	[ConditionOperator.LESS_THAN]: undefined,
	[ConditionOperator.GREATER_THAN_OR_EQUAL]: undefined
});
