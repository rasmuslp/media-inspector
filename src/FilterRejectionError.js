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
		return this.reasons.map(reason => `${reason.path} failed condition '${reason.condition}' with value '${reason.value}'`);
	}

	getPurgeReason() {
		return `FilterRejectionError ${this.getReasonsToString().join(', ')}`;
	}
}

module.exports = FilterRejectionError;
