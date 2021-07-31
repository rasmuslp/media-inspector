import { ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumber, NumberSchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorGreaterThanOrEqualSchema = ConditionSchema.extend({
	value: NumberSchema
});

export class OperatorGreaterThanOrEqual extends Operator<TNumber> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = OperatorGreaterThanOrEqual.convertValue(inputValue);

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
