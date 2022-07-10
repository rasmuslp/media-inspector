import { FsNode } from '../../../fs-tree';
import { IPrintable } from './IPrintable';

export interface IFsTreePrintableTransformer {
	getMessages(printableResults: Map<FsNode, IPrintable>, verbose: boolean): string[]
}
