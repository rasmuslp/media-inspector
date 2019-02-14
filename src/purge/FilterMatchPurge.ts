import chalk from 'chalk';

import { Purge } from './Purge';
import { FilterRuleResult } from '../filter/filter-rule/FilterRuleResult';
import { FsNode } from '../fs-tree';

export class FilterMatchPurge extends Purge {
	_filterResults: FilterRuleResult[];

	constructor(message: string, fsNode: FsNode, filterResults = []) {
		super(message, fsNode);

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
			let filterMessage = `${filterResult.satisfied ? 'MATCHED' : 'failed'}: ${filterResult.getResultsAsStrings().join(', ')}`;
			if (colorized) {
				filterMessage = filterMessage.replace(/matched/gi, match => chalk.green(match));
				filterMessage = filterMessage.replace(/satisfied/gi, match => chalk.green(match));
				filterMessage = filterMessage.replace(/failed/gi, match => chalk.red(match));
			}

			filterMessages.push(filterMessage);
		}

		return filterMessages;
	}

	getPurgeReason({ colorized = false } = {}) {
		return `[Filter Matched]:\n${this.getResultsAsString({ colorized }).map(message => '\t\t' + message).join('\n')}`;
	}
}
