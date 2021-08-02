import { quoteIfNotNumber } from '../../../../utils/quoteIfNotNumber';
import { ConditionSchema } from '../Condition';
import { TNumberOrString, NumberOrStringSchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorNotEqualSchema = ConditionSchema.extend({
	value: NumberOrStringSchema
});

export class OperatorNotEqual extends Operator<TNumberOrString> {
	check(value: number | string): boolean {
		const result = value !== this.value;
		return result;
	}

	toStringForValue(inputValue: number | string): string {
		return `${quoteIfNotNumber(inputValue)} != ${quoteIfNotNumber(this.value)}`;
	}
}
