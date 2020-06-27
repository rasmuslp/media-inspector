import * as t from 'io-ts';

import { FsNode, FsNodeDataValidator } from './FsNode';
import { FsNodeType } from './FsNodeType';

const DirectoryDataPartial = t.type({
	children: t.array(FsNodeDataValidator)
});

export const DirectoryDataValidator = t.intersection([FsNodeDataValidator, DirectoryDataPartial]);

export type DirectoryData = t.TypeOf<typeof DirectoryDataValidator>;

export class Directory extends FsNode<DirectoryData> {
	_children: FsNode[];

	constructor(nodePath: string, stats, children: FsNode[] = []) {
		super(nodePath, stats);
		this._children = children;
		this._fsNodeType = FsNodeType.DIRECTORY;
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

	get directories(): FsNode[] {
		return this._children.filter(i => i.isDirectory());
	}

	get files(): FsNode[] {
		return this._children.filter(i => i.isFile());
	}

	getDataForSerialization(): DirectoryData {
		const data = Object.assign(super.getDataForSerialization(), {
			children: this._children.map(node => node.serialize())
		});

		return data;
	}
}
