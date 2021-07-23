import { z } from 'zod';

import { Condition, ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';

const ValueSchema = z.array(z.union([z.number(), z.string()]));
type Value = z.infer<typeof ValueSchema>;

export const ConditionInSchema = ConditionSchema.extend({
	value: ValueSchema
});

export class ConditionIn extends Condition<Value> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = ConditionIn.convertValue(inputValue);

		// Supports both string and number comparison
		const match = this.value.find(expected => ConditionIn.convertValue(expected) === value);
		if (match) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `in [${this.value.join(', ')}]`;
	}
}
