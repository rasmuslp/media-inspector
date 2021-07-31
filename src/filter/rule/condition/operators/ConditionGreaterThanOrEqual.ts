import { Condition, ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumber, NumberSchema } from '../ConditionValues';

export const ConditionGreaterThanOrEqualSchema = ConditionSchema.extend({
	value: NumberSchema
});

export class ConditionGreaterThanOrEqual extends Condition<TNumber> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = ConditionGreaterThanOrEqual.convertValue(inputValue);

		// Check condition
		if (value >= this.value) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `>= ${this.value}`;
	}
}
