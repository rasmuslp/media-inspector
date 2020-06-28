import { Condition } from '../Condition';
import { ConditionResult, ConditionSatisfied } from '../ConditionResult';

export class ConditionLessThan extends Condition {
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
