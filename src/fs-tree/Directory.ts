import { FsNode, FsNodeType } from './FsNode';

export class Directory extends FsNode {
	_children: FsNode[];

	constructor(objectPath, stats, children = []) {
		super(objectPath, stats);
		this._children = children;
		this._fsNodeType = FsNodeType.DIRECTORY;

		for (const child of children) {
			child._parent = this;
		}
	}

	// Children before parents
	static getSortFnByPathDirFile(a, b) {
		if (a.path.startsWith(b.path)) {
			return -1;
		}
		else if (b.path.startsWith(a.path)) {
			return 1;
		}

		return a.path.localeCompare(b.path);
	}

	get children() {
		return this._children;
	}

	get childrenSorted() {
		const sorted = this._children.sort(Directory.getSortFnByPathDirFile);

		return sorted;
	}

	get directories() {
		return this._children.filter(i => i.isDirectory());
	}

	get files() {
		return this._children.filter(i => i.isFile());
	}

	serializeData() {
		const superData = super.serializeData();
		const serializedChildren = this._children.map(node => node.serialize());
		return Object.assign(superData, {
			children: serializedChildren
		});
	}

	deserialize() {
	}
}
