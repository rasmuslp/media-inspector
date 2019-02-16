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
	[ConditionOperator.BETWEEN]: null,
	[ConditionOperator.IN]: null,
	[ConditionOperator.EQUAL]: null,
	[ConditionOperator.NOT_EQUAL]: null,
	[ConditionOperator.LESS_THAN]: null,
	[ConditionOperator.GREATER_THAN_OR_EQUAL]: null
});
