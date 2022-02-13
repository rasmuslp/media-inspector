import { ConditionResult } from './ConditionResult';
import { ConditionSatisfied } from './ConditionSatisfied';
import { ICondition } from './ICondition';
import { IConditionResult } from './IConditionResult';

export class ConditionChecker {
	static getResultFor(condition: ICondition, value: number | string): IConditionResult {
		const satisfied = condition.check(value);
		if (satisfied) {
			return new ConditionResult(condition, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(condition, value, ConditionSatisfied.NO);
	}
}
