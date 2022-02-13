import { ICondition } from '../../standard';
import { ConditionResult } from './ConditionResult';
import { ConditionSatisfied } from './ConditionSatisfied';
import { IConditionAnalyzer } from './IConditionAnalyzer';
import { IConditionResult } from './IConditionResult';

export class ConditionAnalyzer implements IConditionAnalyzer {
	public analyze(condition: ICondition, value: number | string): IConditionResult {
		const satisfied = condition.check(value);
		if (satisfied) {
			return new ConditionResult(condition, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(condition, value, ConditionSatisfied.NO);
	}
}
