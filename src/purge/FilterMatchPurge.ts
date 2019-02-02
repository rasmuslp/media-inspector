import chalk from 'chalk'

import { Purge } from './Purge';
import { FilterResult } from '../filter/FilterResult';

export class FilterMatchPurge extends Purge {
	_filterResults: FilterResult[];

	constructor(message, fsObject, filterResults = []) {
		super(message, fsObject);

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
