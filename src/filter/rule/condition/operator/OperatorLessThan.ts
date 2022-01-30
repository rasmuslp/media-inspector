import { TNumber } from '../ConditionValues';
import { Operator } from './Operator';

export class OperatorLessThan extends Operator<TNumber> {
	check(value: number): boolean {
		const result = value < this.value;
		return result;
	}

	toStringForValue(inputValue: number): string {
		return `${inputValue} < ${this.value}`;
	}
}
