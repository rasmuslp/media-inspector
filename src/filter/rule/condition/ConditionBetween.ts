import { Condition } from './Condition';
import { ConditionSatisfied } from './condition-result/ConditionSatisfied';
import { ConditionFailed } from './condition-result/ConditionFailed';
import { ConditionResult } from './condition-result/ConditionResult';

export class ConditionBetween extends Condition {
	constructor(path: string, value) {
		super(path, value);

		if (!Array.isArray(this.expectedValue)) {
			throw new Error(`The 'between' operator expects an array of 2 values, not '${this.expectedValue}'. Path: ${path} Value: ${value}`);
		}
	}

	check(inputValue): ConditionResult {
		// Convert the input
		const value = ConditionBetween.convertValue(inputValue);

		// Check condition
		if (this.expectedValue[0] <= value && value <= this.expectedValue[1]) {
			return new ConditionSatisfied(this, value);
		}

		return new ConditionFailed(this, value);
	}

	toString(): string {
		return `${this.expectedValue[0]} <= X <= ${this.expectedValue[1]}`;
	}

	toStringForValue(inputValue): string {
		return `${this.expectedValue[0]} <= ${inputValue} <= ${this.expectedValue[1]}`;
	}
}
