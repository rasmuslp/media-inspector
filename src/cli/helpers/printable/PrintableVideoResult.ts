import chalk from 'chalk';

import { IVideoFileAnalysisResult } from '../../../analyzer/interfaces/IVideoFileAnalysisResult';
import { IPrintable } from './IPrintable';
import { PrintableOptions } from './PrintableOptions';

export class PrintableVideoResult implements IPrintable {
	private readonly videoFileAnalysisResult: IVideoFileAnalysisResult;

	constructor(videoFileAnalysisResult: IVideoFileAnalysisResult) {
		this.videoFileAnalysisResult = videoFileAnalysisResult;
	}

	public getStrings(options?: PrintableOptions): string[] {
		const colorized = options?.colorized ?? false;

		let titleMessage = `[Video] File ${this.videoFileAnalysisResult.isSatisfied ? 'satisfies' : 'does not satisfy'} standard`;
		if (colorized) {
			titleMessage = titleMessage
				.replace('[Video]', match => chalk.yellow(match))
				.replace('satisfies', match => chalk.green(match))
				.replace('does not satisfy', match => chalk.red(match));
		}

		const ruleMessages: string[] = [
			titleMessage
		];

		for (const ruleResult of this.videoFileAnalysisResult.videoRuleResults) {
			let ruleMessage = `Rule '${ruleResult.name}' ${ruleResult.isSatisfied ? 'satisfied' : 'not satisfied'}: `;
			ruleMessage += ruleResult.conditionResults.map(conditionResult => conditionResult.getResultAsString()).join(' | ');
			if (colorized) {
				ruleMessage = ruleMessage
					.replace(/(?<!not )satisfied/gi, match => chalk.green(match))
					.replace(/not satisfied/gi, match => chalk.red(match));
			}
			ruleMessages.push(ruleMessage);
		}

		return ruleMessages;
	}
}
