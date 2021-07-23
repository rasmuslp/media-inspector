import { z } from 'zod';

import { Condition, ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';

const ValueSchema = z.union([z.number(), z.string()]);
type Value = z.infer<typeof ValueSchema>;

export const ConditionEqualSchema = ConditionSchema.extend({
	value: ValueSchema
});

export class ConditionEqual extends Condition<Value> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = ConditionEqual.convertValue(inputValue);

		// Check condition
		if (value === this.value) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `= ${this.value}`;
	}
}
