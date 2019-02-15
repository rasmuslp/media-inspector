import chalk from 'chalk';

import { Purge } from './Purge';

export class RecommendedPurge extends Purge {
	getPurgeReason({ colorized = false } = {}): string {
		return `${colorized ? chalk.green('[Recommended]') : '[Recommended]'} ${this._message}`;
	}
}
