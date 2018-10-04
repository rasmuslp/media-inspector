class RecommendedPurgeError extends Error {
	constructor(message, file) {
		super(message);

		this._file = file;
	}

	getPurgeReason() {
		return `RecommendedPurgeError ${this.message}`;
	}
}

module.exports = RecommendedPurgeError;
