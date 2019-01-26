const chalk = require('chalk');

const Purge = require('./Purge');

class RecommendedPurge extends Purge {
	getPurgeReason({ colorized = false } = {}) {
		// @ts-ignore TODO
		return `${colorized ? chalk.green('[Recommended]') : '[Recommended]'} ${this._message}`;
	}
}

module.exports = RecommendedPurge;
