import { ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumber, NumberSchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorLessThanSchema = ConditionSchema.extend({
	value: NumberSchema
});

export class OperatorLessThan extends Operator<TNumber> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = OperatorLessThan.convertValue(inputValue);

		// Check condition
		if (value < this.value) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toStringForValue(inputValue: number|string): string {
		return `${inputValue} < ${this.value}`;
	}
}
