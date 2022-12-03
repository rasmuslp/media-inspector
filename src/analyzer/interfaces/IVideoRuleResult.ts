import { IConditionResult } from './IConditionResult';

export interface IVideoRuleResult {
	isSatisfied: boolean;

	readonly name: string;

	readonly conditionResults: IConditionResult[];
}
