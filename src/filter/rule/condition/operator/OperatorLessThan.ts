import { ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumber, NumberSchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorLessThanSchema = ConditionSchema.extend({
	value: NumberSchema
});

export class OperatorLessThan extends Operator<TNumber> {
	check(value: number): ConditionResult {
		if (value < this.value) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toStringForValue(inputValue: number): string {
		return `${inputValue} < ${this.value}`;
	}
}
