import { Serializable } from './Serializable';

export interface SerializedFsNodeData {
	path: string;
	stats: any;
}

export enum FsNodeType {
	UNKNOWN,
	DIRECTORY,
	FILE
}

export abstract class FsNode extends Serializable {
	_fsNodeType: FsNodeType;
	_path: string;
	_stats: any;

	constructor(nodePath: string, stats) {
		super();
		this._fsNodeType = FsNodeType.UNKNOWN;
		this._path = nodePath;
		this._stats = {
			size: stats.size || 0
		};
	}

	get path() {
		return this._path;
	}

	get parent() {
		// @ts-ignore TODO
		return this._parent;
	}

	get children() {
		return [];
	}

	get size() {
		return this._stats.size;
	}

	isDirectory() {
		return this._fsNodeType === FsNodeType.DIRECTORY;
	}

	isFile() {
		return this._fsNodeType === FsNodeType.FILE;
	}

	serializeData(): SerializedFsNodeData {
		return {
			path: this._path,
			stats: this._stats
		};
	}
}

