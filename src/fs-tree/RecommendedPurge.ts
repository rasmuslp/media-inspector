import chalk from 'chalk';

import { Purge } from './Purge';

export class RecommendedPurge extends Purge {
	getPurgeReason({ colorized = false } = {}) {
		return `${colorized ? chalk.green('[Recommended]') : '[Recommended]'} ${this._message}`;
	}
}
