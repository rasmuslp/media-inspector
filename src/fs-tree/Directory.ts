import * as t from 'io-ts';

import { FsNode, FsNodeStats, TFsNode } from './FsNode';

const TDirectoryPartial = t.type({
	children: t.array(TFsNode)
});

export const TDirectory = t.intersection([TFsNode, TDirectoryPartial]);
export type DirectoryData = t.TypeOf<typeof TDirectory>;

export class Directory extends FsNode<DirectoryData> {
	_children: FsNode[];

	constructor(nodePath: string, stats: FsNodeStats, children: FsNode[] = []) {
		super(nodePath, stats);
		this._children = children;
	}

	get children(): FsNode[] {
		return this._children;
	}

	getDataForSerialization(): DirectoryData {
		return {
			children: this._children.map(node => node.serialize())
		} as DirectoryData;
	}
}
