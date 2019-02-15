import { Condition } from './Condition';
import { ConditionSatisfied } from './condition-result/ConditionSatisfied';
import { ConditionFailed } from './condition-result/ConditionFailed';
import { ConditionResult } from './condition-result/ConditionResult';

export class ConditionIn extends Condition {
	constructor(path: string, value) {
		super(path, value);

		if (!Array.isArray(this.expectedValue)) {
			throw new Error(`The 'in' operator expects an array, not '${this.expectedValue}'. Path: ${path} Value: ${value}`);
		}
	}

	get expectedValue(): [] {
		return super.expectedValue as [];
	}

	check(inputValue): ConditionResult {
		// Convert the input
		const value = ConditionIn.convertValue(inputValue);

		// Supports both string and number comparison
		const match = this.expectedValue.find(expected => ConditionIn.convertValue(expected) === value);
		if (match) {
			return new ConditionSatisfied(this, value);
		}

		return new ConditionFailed(this, value);
	}

	toString(): string {
		return `in [${this.expectedValue.join(', ')}]`;
	}
}
