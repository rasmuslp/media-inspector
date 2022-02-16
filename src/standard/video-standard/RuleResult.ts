import { IConditionResult } from '../../analyzer/condition/IConditionResult';

export class RuleResult {
	private readonly conditionResults: IConditionResult[];

	constructor(conditionResults: IConditionResult[]) {
		if (conditionResults.length === 0) {
			throw new Error('ConditionResults are required, none were provided.');
		}
		this.conditionResults = conditionResults;
	}

	get satisfied(): boolean {
		// Check if _any_ condition was not satisfied failed
		const anyNotSatisfied = this.conditionResults.find(result => !result.isSatisfied);
		if (anyNotSatisfied) {
			return false;
		}

		return true;
	}

	getResultsAsStrings(): string[] {
		const messages: string[] = [];
		for (const result of this.conditionResults) {
			messages.push(result.getResultAsStrings());
		}

		return messages;
	}
}
