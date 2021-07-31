import { ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumberOrString, NumberOrStringSchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorNotEqualSchema = ConditionSchema.extend({
	value: NumberOrStringSchema
});

export class OperatorNotEqual extends Operator<TNumberOrString> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = OperatorNotEqual.convertValue(inputValue);

		// Check condition
		if (value !== this.value) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toStringForValue(inputValue: number|string): string {
		return `${inputValue} = ${this.value}`;
	}
}
