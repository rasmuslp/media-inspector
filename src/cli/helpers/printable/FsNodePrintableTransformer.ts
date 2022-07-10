import chalk from 'chalk';

import { Directory, FsNode } from '../../../fs-tree';
import { IFsNodePrintableTransformer } from './IFsNodePrintableTransformer';
import { IPrintable } from './IPrintable';
import { PrintableOptions } from './PrintableOptions';

export class FsNodePrintableTransformer implements IFsNodePrintableTransformer {
	public getMessage(node: FsNode, printable: IPrintable, options: PrintableOptions): string {
		let message = `${options.colorized ? chalk.yellow(node.path) : node.path}\n`;
		message += node instanceof Directory ? '[Directory]' : '[File]';
		message += ' ';

		if (!printable) {
			message += `${options.colorized ? chalk.red('ERROR') : 'ERROR'} No printable result provided`;
		}
		else {
			const subMessages = printable.getStrings(options);
			// Slice of first string, and add to current line, then just newline the rest for now
			if (subMessages.length > 0) {
				message += subMessages[0];
			}
			if (subMessages.length > 1) {
				for (let i = 1; i < subMessages.length; i++) {
					message += `\n${subMessages[i]}`;
				}
			}
		}

		return `${message}\n`;
	}
}
