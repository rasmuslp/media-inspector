import { FilterConditionResult } from '../filter-condition/FilterConditionResult';
import {FilterRuleResult} from './FilterRuleResult';

export class FilterMetadataRuleResult extends FilterRuleResult {
	_filterConditionResults: FilterConditionResult[];

	constructor(filterConditionResults = []) {
		super();
		this._filterConditionResults = filterConditionResults;
	}

	get passed() {
		// Check if _any_ failed
		const anyFailed = this._filterConditionResults.find(result => !result.passed);
		if (anyFailed) {
			return false;
		}

		// Otherwise must have succeeded
		return true;
	}

	getResultsAsStrings() {
		let messages = [];
		for (const result of this._filterConditionResults) {
			messages.push(result.toString());
		}

		return messages;
	}

	// Ratio of passes/results
	getScore() {
		const passed = this._filterConditionResults.filter(result => result.passed);
		const score = passed.length / this._filterConditionResults.length;

		return score;
	}

	// Weighted ratio of passes/results
	getWeightedScore() {
		let score = 0;
		for (let i = 0; i < this._filterConditionResults.length; i++) {
			const result = this._filterConditionResults[i];
			if (result.passed) {
				const weigth = this._filterConditionResults.length - i;
				const partialScore = Math.pow(weigth, 2);
				score += partialScore;
			}
		}

		return score;
	}
}
