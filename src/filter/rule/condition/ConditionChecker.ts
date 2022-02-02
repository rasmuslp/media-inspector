import { ICondition } from './ICondition';
import { ConditionResult, ConditionSatisfied } from './ConditionResult';

export class ConditionChecker {
	static getResultFor(condition: ICondition, value: number | string): ConditionResult {
		const satisfied = condition.check(value);
		if (satisfied) {
			return new ConditionResult(condition, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(condition, value, ConditionSatisfied.NO);
	}
}
