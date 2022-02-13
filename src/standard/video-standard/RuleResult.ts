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

	// Ratio of: # satisfied / # conditions
	getScore(): number {
		const satisfiedConditions = this.conditionResults.filter(result => result.isSatisfied);
		const score = satisfiedConditions.length / this.conditionResults.length;

		return score;
	}

	// Weighted ratio of passes/results
	getWeightedScore(): number {
		let score = 0;
		for (let i = 0; i < this.conditionResults.length; i++) {
			const result = this.conditionResults[i];
			if (result.isSatisfied) {
				const weigth = this.conditionResults.length - i;
				const partialScore = weigth ** 2;
				score += partialScore;
			}
		}

		return score;
	}
}
