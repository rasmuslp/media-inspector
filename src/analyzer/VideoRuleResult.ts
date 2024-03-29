import { IConditionResult } from './interfaces/IConditionResult';
import { IVideoRuleResult } from './interfaces/IVideoRuleResult';

export class VideoRuleResult implements IVideoRuleResult {
	public readonly name: string;

	public readonly conditionResults: IConditionResult[];

	constructor(name: string, conditionResults: IConditionResult[]) {
		this.name = name;
		this.conditionResults = conditionResults;
	}

	get isSatisfied(): boolean {
		// Check if _any_ condition was not satisfied
		const anyNotSatisfied = this.conditionResults.find(result => !result.isSatisfied);
		if (anyNotSatisfied) {
			return false;
		}

		return true;
	}
}
