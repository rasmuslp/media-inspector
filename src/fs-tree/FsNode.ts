import { Serializable } from './Serializable';

export interface SerializedFsNodeData {
	path: string;
	stats;
}

export enum FsNodeType {
	UNKNOWN,
	DIRECTORY,
	FILE
}

export abstract class FsNode extends Serializable {
	_fsNodeType: FsNodeType;
	_path: string;
	_stats;

	constructor(nodePath: string, stats) {
		super();
		this._fsNodeType = FsNodeType.UNKNOWN;
		this._path = nodePath;
		this._stats = {
			size: stats.size || 0
		};
	}

	get path(): string {
		return this._path;
	}

	get children(): FsNode[] {
		return [];
	}

	get size(): number {
		return this._stats.size;
	}

	isDirectory(): boolean {
		return this._fsNodeType === FsNodeType.DIRECTORY;
	}

	isFile(): boolean {
		return this._fsNodeType === FsNodeType.FILE;
	}

	serializeData(): SerializedFsNodeData {
		return {
			path: this._path,
			stats: this._stats
		};
	}
}
