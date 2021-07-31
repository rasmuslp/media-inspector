import { ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumberOrString, NumberOrStringSchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorEqualSchema = ConditionSchema.extend({
	value: NumberOrStringSchema
});

export class OperatorEqual extends Operator<TNumberOrString> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = OperatorEqual.convertValue(inputValue);

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
