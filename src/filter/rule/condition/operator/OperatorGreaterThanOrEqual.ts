import { ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumber, NumberSchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorGreaterThanOrEqualSchema = ConditionSchema.extend({
	value: NumberSchema
});

export class OperatorGreaterThanOrEqual extends Operator<TNumber> {
	check(value: number): ConditionResult {
		if (value >= this.value) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toStringForValue(inputValue: number): string {
		return `${inputValue} >= ${this.value}`;
	}
}
