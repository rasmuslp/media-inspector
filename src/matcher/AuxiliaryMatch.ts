import chalk from 'chalk';

import { Match } from './Match';

export class AuxiliaryMatch extends Match {
	getMatchReason({ colorized = false } = {}): string {
		return `${colorized ? chalk.green('[Auxiliary]') : '[Auxiliary]'} ${this._message}`;
	}
}
