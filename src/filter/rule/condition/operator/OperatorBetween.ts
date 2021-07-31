import { ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumberRange, NumberRangeSchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorBetweenSchema = ConditionSchema.extend({
	value: NumberRangeSchema
});

export class OperatorBetween extends Operator<TNumberRange> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = OperatorBetween.convertValue(inputValue);

		// Check condition
		if (this.value[0] <= value && value <= this.value[1]) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toStringForValue(inputValue: number|string): string {
		return `${this.value[0]} <= ${inputValue} <= ${this.value[1]}`;
	}
}
