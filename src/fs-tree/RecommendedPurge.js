const Purge = require('./Purge');

class RecommendedPurge extends Purge {
	getPurgeReason() {
		return `[Recommended] ${this._message}`;
	}
}

module.exports = RecommendedPurge;
