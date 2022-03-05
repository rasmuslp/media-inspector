import { FsNode, PathSorters } from '../../../fs-tree';
import { IFsNodePrintableTransformer } from './IFsNodePrintableTransformer';
import { IFsTreePrintableTransformer } from './IFsTreePrintableTransformer';
import { IPrintable } from './IPrintable';

export class FsTreePrintableTransformer implements IFsTreePrintableTransformer {
	private readonly fsNodePrintableTransformer: IFsNodePrintableTransformer;

	constructor(fsNodePrintableTransformer: IFsNodePrintableTransformer) {
		this.fsNodePrintableTransformer = fsNodePrintableTransformer;
	}

	public getMessages(printableResults: Map<FsNode, IPrintable>, verbose: boolean): string[] {
		const messages: string[] = [];

		// Get FsNodes and sort by path
		const nodesSortedByPath = [...printableResults.keys()].sort((a, b) => PathSorters.childrenBeforeParents(a.path, b.path));
		for (const node of nodesSortedByPath) {
			if (verbose) {
				const printableResult = printableResults.get(node);

				const message = this.fsNodePrintableTransformer.getMessage(node, printableResult, { colorized: true });
				messages.push(message);
			}
			else {
				messages.push(node.path);
			}
		}

		return messages;
	}
}
