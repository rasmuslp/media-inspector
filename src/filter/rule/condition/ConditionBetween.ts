import { Condition } from './Condition';
import { ConditionResult, ConditionSatisfied } from './ConditionResult';

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
