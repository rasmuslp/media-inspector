class FilterRejectionError extends Error {
	constructor(message, file, reasons) {
		super(message);

		this._file = file;
		this._reasons = reasons;
	}

	get reasons() {
		return this._reasons;
	}
}

module.exports = FilterRejectionError;
