import * as t from 'io-ts';

import { Condition, TCondition } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';

export const TConditionLessThanValueType = t.number;
export type ConditionLessThanValueType = t.TypeOf<typeof TConditionLessThanValueType>;

const TConditionLessThanPartial = t.type({
	value: TConditionLessThanValueType
});
export const TConditionLessThan = t.intersection([TConditionLessThanPartial, TCondition]);
export type ConditionLessThanData = t.TypeOf<typeof TConditionLessThan>;

export class ConditionLessThan extends Condition<ConditionLessThanValueType> {
	check(inputValue): ConditionResult {
		// Convert the input
		const value = ConditionLessThan.convertValue(inputValue);

		// Check condition
		if (value < this.expectedValue) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `< ${this.expectedValue}`;
	}
}
