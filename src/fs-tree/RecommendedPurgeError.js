class RecommendedPurgeError extends Error {
	constructor(message, file) {
		super(message);

		this._file = file;
	}

	getPurgeReason() {
		return `[Recommended] ${this.message}`;
	}
}

module.exports = RecommendedPurgeError;
