class FilterResult {
	constructor(filterConditionResults = []) {
		this._filterConditionResults = filterConditionResults;
	}

	get filterConditionResults() {
		return this._filterConditionResults;
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
}

module.exports = FilterResult;
