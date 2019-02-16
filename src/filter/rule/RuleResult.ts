import { ConditionResult } from './condition/ConditionResult';

export class RuleResult {
	_conditionResults: ConditionResult[];

	constructor(conditionResults = []) {
		this._conditionResults = conditionResults;
	}

	get satisfied(): boolean {
		// Check if _any_ condition was not satisfied failed
		const anyNotSatisfied = this._conditionResults.find(result => !result.satisfied);
		if (anyNotSatisfied) {
			return false;
		}

		return true;
	}

	getResultsAsStrings(): string[] {
		let messages = [];
		for (const result of this._conditionResults) {
			messages.push(result.toString());
		}

		return messages;
	}

	// Ratio of: # satisfied / # conditions
	getScore(): number {
		const satisfiedConditions = this._conditionResults.filter(result => result.satisfied);
		const score = satisfiedConditions.length / this._conditionResults.length;

		return score;
	}

	// Weighted ratio of passes/results
	getWeightedScore(): number {
		let score = 0;
		for (let i = 0; i < this._conditionResults.length; i++) {
			const result = this._conditionResults[i];
			if (result.satisfied) {
				const weigth = this._conditionResults.length - i;
				const partialScore = Math.pow(weigth, 2);
				score += partialScore;
			}
		}

		return score;
	}
}
