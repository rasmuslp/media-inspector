import { Condition, ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumberOrString, NumberOrStringSchema } from '../ConditionValues';

export const ConditionEqualSchema = ConditionSchema.extend({
	value: NumberOrStringSchema
});

export class ConditionEqual extends Condition<TNumberOrString> {
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
