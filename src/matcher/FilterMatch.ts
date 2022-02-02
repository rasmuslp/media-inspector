import chalk from 'chalk';

import { RuleResult } from '../standard/rule/RuleResult';
import { Match, MatchReasonOptions } from './Match';
import { FsNode } from '../fs-tree';

export class FilterMatch extends Match {
	private ruleResults: RuleResult[];

	constructor(message: string, fsNode: FsNode, ruleResults: RuleResult[] = []) {
		super(message, fsNode);

		this.ruleResults = ruleResults;
	}

	get score(): number {
		return 1;
	}

	getResultsAsStrings({ colorized = false } = {}): string[] {
		// Filter to remove any 'passed' entries, as they are stored as null
		const ruleMessages: string[] = [];
		const ruleResultsSorted = [...this.ruleResults].sort((a, b) => a.getWeightedScore() - b.getWeightedScore()).reverse();
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

	getMatchReason(options: MatchReasonOptions): string {
		const colorized = options.colorized ?? false;
		return `[Filter Matched]:\n${this.getResultsAsStrings({ colorized }).map(message => `\t\t${message}`).join('\n')}`;
	}
}
