import { ICondition } from '../../standard';
import { IConditionResult } from './IConditionResult';

export interface IConditionAnalyzer {
	analyze(condition: ICondition, value: number | string): IConditionResult
}
