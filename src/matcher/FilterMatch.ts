import chalk from 'chalk';

import { RuleResult } from '../standard/video-standard/RuleResult';
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
		for (const ruleResult of this.ruleResults) {
			let ruleMessage = `${ruleResult.satisfied ? 'Satisfied' : 'MATCHED'}: ${ruleResult.getResultsAsStrings().join(', ')}`;
			if (colorized) {
				ruleMessage = ruleMessage.replace(/matched/gi, match => chalk.red(match));
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
