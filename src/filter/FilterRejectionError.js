class FilterRejectionError extends Error {
	constructor(message, file, reasons) {
		super(message);

		this._file = file;
		this._reasons = reasons;
	}

	get reasons() {
		return this._reasons;
	}

	getReasonsToString() {
		// Filter to remove any 'passed' entries, as they are stored as null
		return this.reasons.filter(reason => reason).map(reason => `${reason.path} failed condition '${reason.conditionStringified}' with value '${reason.value}'`);
	}

	getPurgeReason() {
		return `[Filter Not Satisfied] ${this.getReasonsToString().join(', ')}`;
	}
}

module.exports = FilterRejectionError;
