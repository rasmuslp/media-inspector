import { FsNode, FsNodeType, SerializedFsNodeData } from './FsNode';
import { Serialized } from './Serialized';

export interface SerializedDirectoryData extends SerializedFsNodeData {
	children: Serialized<SerializedFsNodeData>[];
}

export class Directory extends FsNode {
	_children: FsNode[];

	constructor(nodePath, stats, children = []) {
		super(nodePath, stats);
		this._children = children;
		this._fsNodeType = FsNodeType.DIRECTORY;
	}

	// Children before parents
	static getSortFnByPathDirFile(a, b): number {
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
		const sorted = this._children.sort(Directory.getSortFnByPathDirFile);

		return sorted;
	}

	get directories(): FsNode[] {
		return this._children.filter(i => i.isDirectory());
	}

	get files(): FsNode[] {
		return this._children.filter(i => i.isFile());
	}

	serialize(): Serialized<SerializedDirectoryData> {
		return {
			instance: this.constructor.name,
			data: this.serializeData()
		};
	}

	serializeData(): SerializedDirectoryData {
		const superData = super.serializeData();
		const serializedChildren = this._children.map(node => node.serialize());
		return Object.assign(superData, {
			children: serializedChildren as Serialized<SerializedFsNodeData>[]
		});
	}
}
