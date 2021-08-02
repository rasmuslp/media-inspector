import { ConditionSchema } from '../Condition';
import { TNumber, NumberSchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorGreaterThanOrEqualSchema = ConditionSchema.extend({
	value: NumberSchema
});

export class OperatorGreaterThanOrEqual extends Operator<TNumber> {
	check(value: number): boolean {
		const result = value >= this.value;
		return result;
	}

	toStringForValue(inputValue: number): string {
		return `${inputValue} >= ${this.value}`;
	}
}
