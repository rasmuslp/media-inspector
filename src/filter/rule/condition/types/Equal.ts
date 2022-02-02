import { quoteIfNotNumber } from '../../../../utils/quoteIfNotNumber';
import { AbstractCondition } from '../AbstractCondition';
import { TNumberOrString } from '../ConditionValues';

export class Equal extends AbstractCondition<TNumberOrString> {
	check(value: number | string): boolean {
		const result = value === this.value;
		return result;
	}

	toStringForValue(inputValue: number | string): string {
		return `${quoteIfNotNumber(inputValue)} = ${quoteIfNotNumber(this.value)}`;
	}
}
