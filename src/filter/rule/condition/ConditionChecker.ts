import { Condition } from './Condition';
import { ConditionResult, ConditionSatisfied } from './ConditionResult';

export class ConditionChecker {
	static getResultFor(condition: Condition, value: number | string): ConditionResult {
		const satisfied = condition.check(value);
		if (satisfied) {
			return new ConditionResult(condition, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(condition, value, ConditionSatisfied.NO);
	}
}
