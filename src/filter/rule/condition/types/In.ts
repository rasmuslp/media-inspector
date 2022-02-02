import { quoteIfNotNumber } from '../../../../utils/quoteIfNotNumber';
import { stringToStringOrNumber } from '../../../../utils/stringToStringOrNumber';
import { AbstractCondition } from '../AbstractCondition';
import { TNumberOrStringArray } from '../ConditionValues';

export class In extends AbstractCondition<TNumberOrStringArray> {
	check(value: number | string): boolean {
		const result = !!this.value.some(expected => stringToStringOrNumber(expected as string) === value);
		return result;
	}

	toStringForValue(inputValue: number | string): string {
		return `${quoteIfNotNumber(inputValue)} in [${this.value.map(i => quoteIfNotNumber(i)).join(', ')}]`;
	}
}
