import { TNumberRange } from '../ConditionValues';
import { Operator } from './Operator';

export class OperatorBetween extends Operator<TNumberRange> {
	check(value: number): boolean {
		const result = this.value[0] <= value && value <= this.value[1];
		return result;
	}

	toStringForValue(inputValue: number): string {
		return `${this.value[0]} <= ${inputValue} <= ${this.value[1]}`;
	}
}
