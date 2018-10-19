class FilterRejectionError extends Error {
	constructor(message, file, filterResults = []) {
		super(message);

		this._file = file;
		this._filterResults = filterResults;
	}

	getResultsAsString() {
		// Filter to remove any 'passed' entries, as they are stored as null
		const filterMessages = [];
		for (const filterResult of this._filterResults) {
			const filterMessage = `${filterResult.passed ? 'PASSED' : 'FAILED'}: ${filterResult.getResultsAsStrings().join(', ')}`;
			filterMessages.push(filterMessage);
		}

		return filterMessages;
	}

	getPurgeReason() {
		return `[Filter Not Satisfied]:\n${this.getResultsAsString().map(message => '\t\t' + message).join('\n')}`;
	}
}

module.exports = FilterRejectionError;
