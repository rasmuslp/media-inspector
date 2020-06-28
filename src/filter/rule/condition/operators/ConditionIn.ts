import * as t from 'io-ts';

import { Condition, TCondition } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';

export const TConditionInValueType = t.array(t.union([t.number, t.string]));
export type ConditionInValueType = t.TypeOf<typeof TConditionInValueType>;

const TConditionInPartial = t.type({
	value: TConditionInValueType
});
export const TConditionIn = t.intersection([TConditionInPartial, TCondition]);
export type ConditionInData = t.TypeOf<typeof TConditionIn>;

export class ConditionIn extends Condition<ConditionInValueType> {
	check(inputValue): ConditionResult {
		// Convert the input
		const value = ConditionIn.convertValue(inputValue);

		// Supports both string and number comparison
		const match = this.value.find(expected => ConditionIn.convertValue(expected) === value);
		if (match) {
			return new ConditionResult(this, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(this, value, ConditionSatisfied.NO);
	}

	toString(): string {
		return `in [${this.value.join(', ')}]`;
	}
}
