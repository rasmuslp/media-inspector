class FilterResult {
	constructor(filterConditionResults = []) {
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
			let message = `${result.path} ${result.passed ? 'passed' : 'failed'}: `;
			message += `'${result.value}' ${result.conditionStringified}`;

			messages.push(message);
		}

		return messages;
	}
}

module.exports = FilterResult;
