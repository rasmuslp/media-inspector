import chalk from 'chalk';

import { Match } from './Match';
import { RuleResult } from '../filter/rule/RuleResult';
import { FsNode } from '../fs-tree';

export class FilterMatch extends Match {
	_ruleResults: RuleResult[];

	constructor(message: string, fsNode: FsNode, ruleResults: RuleResult[] = []) {
		super(message, fsNode);

		this._ruleResults = ruleResults;
	}

	get score(): number {
		return 1;
	}

	getResultsAsStrings({ colorized = false } = {}): string[] {
		// Filter to remove any 'passed' entries, as they are stored as null
		const ruleMessages: string[] = [];
		const ruleResultsSorted = [...this._ruleResults].sort((a, b) => a.getWeightedScore() - b.getWeightedScore()).reverse();
		for (const ruleResult of ruleResultsSorted) {
			let ruleMessage = `${ruleResult.satisfied ? 'MATCHED' : 'failed'}: ${ruleResult.getResultsAsStrings().join(', ')}`;
			if (colorized) {
				ruleMessage = ruleMessage.replace(/matched/gi, match => chalk.green(match));
				ruleMessage = ruleMessage.replace(/satisfied/gi, match => chalk.green(match));
				ruleMessage = ruleMessage.replace(/failed/gi, match => chalk.red(match));
			}

			ruleMessages.push(ruleMessage);
		}

		return ruleMessages;
	}

	getMatchReason({ colorized = false } = {}): string {
		return `[Filter Matched]:\n${this.getResultsAsStrings({ colorized }).map(message => '\t\t' + message).join('\n')}`;
	}
}
