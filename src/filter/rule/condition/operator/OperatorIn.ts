import { quoteIfNotNumber } from '../../../../utils/quoteIfNotNumber';
import { stringToStringOrNumber } from '../../../../utils/stringToStringOrNumber';
import { ConditionSchema } from '../Condition';
import { TNumberOrStringArray, NumberOrStringArraySchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorInSchema = ConditionSchema.extend({
	value: NumberOrStringArraySchema
});

export class OperatorIn extends Operator<TNumberOrStringArray> {
	check(value: number | string): boolean {
		const result = !!this.value.some(expected => stringToStringOrNumber(expected as string) === value);
		return result;
	}

	toStringForValue(inputValue: number | string): string {
		return `${quoteIfNotNumber(inputValue)} in [${this.value.map(i => quoteIfNotNumber(i)).join(', ')}]`;
	}
}
