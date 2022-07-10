import { ICondition } from '../../standard';
import { IConditionAnalyzer } from '../interfaces/IConditionAnalyzer';
import { IConditionResult } from '../interfaces/IConditionResult';
import { ConditionResult } from './ConditionResult';
import { ConditionSatisfied } from './ConditionSatisfied';

export class ConditionAnalyzer implements IConditionAnalyzer {
	public analyze(condition: ICondition, value: number | string): IConditionResult {
		const satisfied = condition.check(value);
		if (satisfied) {
			return new ConditionResult(condition, value, ConditionSatisfied.YES);
		}

		return new ConditionResult(condition, value, ConditionSatisfied.NO);
	}
}
