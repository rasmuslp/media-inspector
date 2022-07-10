import chalk from 'chalk';

import { IPrintable } from './IPrintable';
import { PrintableOptions } from './PrintableOptions';

export class PrintableAuxiliaryResult implements IPrintable {
	private readonly message: string;

	constructor(message: string) {
		this.message = message;
	}

	public getStrings(options?: PrintableOptions): string[] {
		const colorized = options?.colorized ?? false;
		return [
			`${colorized ? chalk.yellow('[Auxiliary]') : '[Auxiliary]'} ${this.message}`
		];
	}
}
