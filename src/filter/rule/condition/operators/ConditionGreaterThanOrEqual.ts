import * as t from 'io-ts';

import { Condition, TCondition } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';

export const TConditionGreaterThanOrEqualValueType = t.number;
export type ConditionGreaterThanOrEqualValueType = t.TypeOf<typeof TConditionGreaterThanOrEqualValueType>;

const TConditionGreaterThanOrEqualPartial = t.type({
	value: TConditionGreaterThanOrEqualValueType
});
export const TConditionGreaterThanOrEqual = t.intersection([TConditionGreaterThanOrEqualPartial, TCondition]);
export type ConditionGreaterThanOrEqualData = t.TypeOf<typeof TConditionGreaterThanOrEqual>;

export class ConditionGreaterThanOrEqual extends Condition<ConditionGreaterThanOrEqualValueType> {
	check(inputValue): ConditionResult {
		// Convert the input
		const value = ConditionGreaterThanOrEqual.convertValue(inputValue);

		// Check condition
		if (value >= this.expectedValue) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `>= ${this.expectedValue}`;
	}
}
