import { z } from 'zod';

import { Condition, ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';

const ValueSchema = z.union([z.number(), z.string()]);
type Value = z.infer<typeof ValueSchema>;

export const ConditionNotEqualSchema = ConditionSchema.extend({
	value: ValueSchema
});

export class ConditionNotEqual extends Condition<Value> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = ConditionNotEqual.convertValue(inputValue);

		// Check condition
		if (value !== this.value) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `= ${this.value}`;
	}
}
