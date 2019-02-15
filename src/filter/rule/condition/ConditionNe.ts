import { Condition } from './Condition';
import { ConditionSatisfied } from './condition-result/ConditionSatisfied';
import { ConditionFailed } from './condition-result/ConditionFailed';

export class ConditionNe extends Condition {
	check(inputValue) {
		// Convert the input
		const value = ConditionNe.convertValue(inputValue);

		// Check condition
		if (value !== this.expectedValue) {
			return new ConditionSatisfied(this, value);
		}

		return new ConditionFailed(this, value);
	}

	toString() {
		return `= ${this.expectedValue}`;
	}
}
