class Purge {
	constructor(message, file) {
		this._message = message;
		this.file = file;
	}

	// NB: Override this!
	getPurgeReason() {
		return `[UNKNOWN] ${this._message}`;
	}
}

module.exports = Purge;
