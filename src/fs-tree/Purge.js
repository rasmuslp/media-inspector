class Purge {
	constructor(message, file) {
		this._message = message;
		this.file = file;
	}

	get score() {
		return 0;
	}

	// NB: Override this!
	getPurgeReason() {
		return `[UNKNOWN] ${this._message}`;
	}
}

module.exports = Purge;
