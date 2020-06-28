import * as t from 'io-ts';

import { Condition, TCondition } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';

export const TConditionEqualValueType = t.union([t.number, t.string]);
export type ConditionEqualValueType = t.TypeOf<typeof TConditionEqualValueType>;

const TConditionEqualPartial = t.type({
	value: TConditionEqualValueType
});
export const TConditionEqual = t.intersection([TConditionEqualPartial, TCondition]);
export type ConditionEqualData = t.TypeOf<typeof TConditionEqual>;

export class ConditionEqual extends Condition<ConditionEqualValueType> {
	check(inputValue: string): ConditionResult {
		// Convert the input
		const value = ConditionEqual.convertValue(inputValue);

		// Check condition
		if (value === this.value) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `= ${this.value}`;
	}
}
