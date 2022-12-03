import { FsNode } from '../../../fs-tree';
import { IPrintable } from './IPrintable';
import { PrintableOptions } from './PrintableOptions';

export interface IFsNodePrintableTransformer {
	getMessage(node: FsNode, printable: IPrintable, options: PrintableOptions): string;
}
