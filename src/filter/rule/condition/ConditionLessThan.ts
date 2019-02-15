import { Condition } from './Condition';
import { ConditionSatisfied } from './condition-result/ConditionSatisfied';
import { ConditionFailed } from './condition-result/ConditionFailed';
import { ConditionResult } from './condition-result/ConditionResult';

export class ConditionLessThan extends Condition {
	check(inputValue): ConditionResult {
		// Convert the input
		const value = ConditionLessThan.convertValue(inputValue);

		// Check condition
		if (value < this.expectedValue) {
			return new ConditionSatisfied(this, value);
		}

		return new ConditionFailed(this, value);
	}

	toString(): string {
		return `< ${this.expectedValue}`;
	}
}
