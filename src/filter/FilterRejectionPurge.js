const chalk = require('chalk');

const Purge = require('../fs-tree/Purge');

class FilterRejectionPurge extends Purge {
	constructor(message, file, filterResults = []) {
		super(message, file);

		this._filterResults = filterResults;
	}

	get score() {
		return 1;
	}

	getResultsAsString({ colorized = false } = {}) {
		// Filter to remove any 'passed' entries, as they are stored as null
		const filterMessages = [];
		const sorted = [...this._filterResults].sort((a, b) => a.getWeightedScore() - b.getWeightedScore()).reverse();
		for (const filterResult of sorted) {
			let filterMessage = `${filterResult.passed ? 'PASSED' : 'FAILED'}: ${filterResult.getResultsAsStrings().join(', ')}`;
			if (colorized) {
				filterMessage = filterMessage.replace(/passed/gi, match => chalk.green(match));
				filterMessage = filterMessage.replace(/failed/gi, match => chalk.red(match));
			}

			filterMessages.push(filterMessage);
		}

		return filterMessages;
	}

	getPurgeReason({ colorized = false } = {}) {
		return `[Filter Not Satisfied]:\n${this.getResultsAsString({ colorized }).map(message => '\t\t' + message).join('\n')}`;
	}
}

module.exports = FilterRejectionPurge;
