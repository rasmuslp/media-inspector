import * as t from 'io-ts';

import { Condition, TCondition } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';

export const TConditionNotEqualValueType = t.union([t.number, t.string]);
export type ConditionNotEqualValueType = t.TypeOf<typeof TConditionNotEqualValueType>;

const TConditionNotEqualPartial = t.type({
	value: TConditionNotEqualValueType
});
export const TConditionNotEqual = t.intersection([TConditionNotEqualPartial, TCondition]);
export type ConditionNotEqualData = t.TypeOf<typeof TConditionNotEqual>;

export class ConditionNotEqual extends Condition<ConditionNotEqualValueType> {
	check(inputValue): ConditionResult {
		// Convert the input
		const value = ConditionNotEqual.convertValue(inputValue);

		// Check condition
		if (value !== this.expectedValue) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `= ${this.expectedValue}`;
	}
}
