import { ConditionSchema } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';
import { TNumberOrString, NumberOrStringSchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorEqualSchema = ConditionSchema.extend({
	value: NumberOrStringSchema
});

export class OperatorEqual extends Operator<TNumberOrString> {
	check(value: number | string): ConditionResult {
		if (value === this.value) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toStringForValue(inputValue: number | string): string {
		return `${inputValue} = ${this.value}`;
	}
}
