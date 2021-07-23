import { z } from 'zod';

import { Condition, ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';

const ValueSchema = z.tuple([z.number(), z.number()]);
type Value = z.infer<typeof ValueSchema>;

export const ConditionBetweenSchema = ConditionSchema.extend({
	value: ValueSchema
});

export class ConditionBetween extends Condition<Value> {
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
