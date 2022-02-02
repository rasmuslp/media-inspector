import { AbstractCondition } from '../AbstractCondition';
import { TNumberRange } from '../ConditionValues';

export class Between extends AbstractCondition<TNumberRange> {
	check(value: number): boolean {
		const result = this.value[0] <= value && value <= this.value[1];
		return result;
	}

	toStringForValue(inputValue: number): string {
		return `${this.value[0]} <= ${inputValue} <= ${this.value[1]}`;
	}
}
