import chalk from 'chalk';

import { Match } from './Match';

export class RecommendedMatch extends Match {
	getMatchReason({ colorized = false } = {}): string {
		return `${colorized ? chalk.green('[Recommended]') : '[Recommended]'} ${this._message}`;
	}
}
