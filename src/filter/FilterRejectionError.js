class FilterRejectionError extends Error {
	constructor(message, file, filterResults = []) {
		super(message);

		this._file = file;
		this._filterResults = filterResults;
	}

	get reasons() {
		return this._filterResults;
	}

	getReasonsToString() {
		// Filter to remove any 'passed' entries, as they are stored as null
		const filterMessages = [];
		for (const filterResult of this._filterResults) {
			let conditionMessages = [];
			for (const filterConditionResult of filterResult.filterConditionResults) {
				let message = `${filterConditionResult.path} ${filterConditionResult.passed ? 'passed' : 'failed'}: `;
				message += `'${filterConditionResult.value}' ${filterConditionResult.conditionStringified}`;

				conditionMessages.push(message);
			}

			const filterMessage = `\t\t${filterResult.passed ? 'PASSED' : 'FAILED'}: ${conditionMessages.join(', ')}`;
			filterMessages.push(filterMessage);
		}

		return filterMessages;
	}

	getPurgeReason() {
		return `[Filter Not Satisfied]:\n${this.getReasonsToString().join('\n')}`;
	}
}

module.exports = FilterRejectionError;
