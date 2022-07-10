import { Metadata } from '../../metadata/Metadata';
import { ICondition } from '../../standard';
import { IConditionResult } from './IConditionResult';

export interface IConditionsAnalyzer {
	analyze(conditions: ICondition[], metadata: Metadata): IConditionResult[]
}
