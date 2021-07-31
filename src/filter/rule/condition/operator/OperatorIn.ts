import { ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumberOrStringArray, NumberOrStringArraySchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorInSchema = ConditionSchema.extend({
	value: NumberOrStringArraySchema
});

export class OperatorIn extends Operator<TNumberOrStringArray> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = OperatorIn.convertValue(inputValue);

		// Supports both string and number comparison
		const match = !!this.value.some(expected => OperatorIn.convertValue(expected) === value);
		if (match) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `in [${this.value.join(', ')}]`;
	}
}
