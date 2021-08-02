import { ConditionSchema } from '../Condition';
import { TNumber, NumberSchema } from '../ConditionValues';
import { Operator } from './Operator';

export const OperatorLessThanSchema = ConditionSchema.extend({
	value: NumberSchema
});

export class OperatorLessThan extends Operator<TNumber> {
	check(value: number): boolean {
		const result = value < this.value;
		return result;
	}

	toStringForValue(inputValue: number): string {
		return `${inputValue} < ${this.value}`;
	}
}
