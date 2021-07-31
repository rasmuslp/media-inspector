import { Condition, ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumberRange, NumberRangeSchema } from '../ConditionValues';

export const ConditionBetweenSchema = ConditionSchema.extend({
	value: NumberRangeSchema
});

export class ConditionBetween extends Condition<TNumberRange> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = ConditionBetween.convertValue(inputValue);

		// Check condition
		if (this.value[0] <= value && value <= this.value[1]) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `${this.value[0]} <= X <= ${this.value[1]}`;
	}

	toStringForValue(inputValue: string): string {
		return `${this.value[0]} <= ${inputValue} <= ${this.value[1]}`;
	}
}
