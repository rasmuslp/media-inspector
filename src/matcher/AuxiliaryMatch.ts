import chalk from 'chalk';

import { Match, MatchReasonOptions } from './Match';

export class AuxiliaryMatch extends Match {
	getMatchReason(options: MatchReasonOptions): string {
		const colorized = options.colorized ?? false;
		return `${colorized ? chalk.yellow('[Auxiliary]') : '[Auxiliary]'} ${this.message}`;
	}
}
