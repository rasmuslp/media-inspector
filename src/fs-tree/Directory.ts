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

	// Children before parents
	static getSortFnByPathDirFile(a: FsNode, b: FsNode): number {
		if (a.path.startsWith(b.path)) {
			return -1;
		}
		else if (b.path.startsWith(a.path)) {
			return 1;
		}

		return a.path.localeCompare(b.path);
	}

	get children(): FsNode[] {
		return this._children;
	}

	get childrenSorted(): FsNode[] {
		const sorted = this._children.sort(Directory.getSortFnByPathDirFile.bind(Directory));

		return sorted;
	}

	getDataForSerialization(): DirectoryData {
		return {
			children: this._children.map(node => node.serialize())
		} as DirectoryData;
	}
}
