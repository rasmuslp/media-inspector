import { AbstractCondition } from '../AbstractCondition';
import { TNumber } from '../ConditionValues';

export class GreaterThanOrEqual extends AbstractCondition<TNumber> {
	check(value: number): boolean {
		const result = value >= this.value;
		return result;
	}

	toStringForValue(inputValue: number): string {
		return `${inputValue} >= ${this.value}`;
	}
}
