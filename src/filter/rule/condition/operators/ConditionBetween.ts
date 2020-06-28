import * as t from 'io-ts';

import { Condition, TCondition } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';

export const TConditionBetweenValueType = t.tuple([t.number, t.number]);
export type ConditionBetweenValueType = t.TypeOf<typeof TConditionBetweenValueType>;

const TConditionBetweenPartial = t.type({
	value: TConditionBetweenValueType
});
export const TConditionBetween = t.intersection([TConditionBetweenPartial, TCondition]);
export type ConditionBetweenData = t.TypeOf<typeof TConditionBetween>;

export class ConditionBetween extends Condition<ConditionBetweenValueType> {
	check(inputValue): ConditionResult {
		// Convert the input
		const value = ConditionBetween.convertValue(inputValue);

		// Check condition
		if (this.expectedValue[0] <= value && value <= this.expectedValue[1]) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `${this.expectedValue[0]} <= X <= ${this.expectedValue[1]}`;
	}

	toStringForValue(inputValue): string {
		return `${this.expectedValue[0]} <= ${inputValue} <= ${this.expectedValue[1]}`;
	}
}
