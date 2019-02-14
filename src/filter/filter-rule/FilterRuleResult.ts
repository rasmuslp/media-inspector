import { FilterConditionResult } from './filter-condition/filter-condition-result/FilterConditionResult';

export class FilterRuleResult {
	_filterConditionResults: FilterConditionResult[];

	constructor(filterConditionResults = []) {
		this._filterConditionResults = filterConditionResults;
	}

	get satisfied(): boolean {
		// Check if _any_ condition was not satisfied failed
		const anyNotSatisfied = this._filterConditionResults.find(result => !result.satisfied);
		if (anyNotSatisfied) {
			return false;
		}

		return true;
	}

	getResultsAsStrings() {
		let messages = [];
		for (const result of this._filterConditionResults) {
			messages.push(result.toString());
		}

		return messages;
	}

	// Ratio of: # satisfied / # conditions
	getScore() {
		const satisfiedConditions = this._filterConditionResults.filter(result => result.satisfied);
		const score = satisfiedConditions.length / this._filterConditionResults.length;

		return score;
	}

	// Weighted ratio of passes/results
	getWeightedScore() {
		let score = 0;
		for (let i = 0; i < this._filterConditionResults.length; i++) {
			const result = this._filterConditionResults[i];
			if (result.satisfied) {
				const weigth = this._filterConditionResults.length - i;
				const partialScore = Math.pow(weigth, 2);
				score += partialScore;
			}
		}

		return score;
	}
}
