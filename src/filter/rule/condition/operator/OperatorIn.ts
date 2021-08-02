import { stringToStringOrNumber } from '../../../../utils/stringToStringOrNumber';
import { ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumberOrStringArray, NumberOrStringArraySchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorInSchema = ConditionSchema.extend({
	value: NumberOrStringArraySchema
});

export class OperatorIn extends Operator<TNumberOrStringArray> {
	check(value: number | string): ConditionResult {
		const match = !!this.value.some(expected => stringToStringOrNumber(expected as string) === value);
		if (match) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toStringForValue(inputValue: number | string): string {
		return `'${inputValue}' in [${this.value.join(', ')}]`;
	}
}
