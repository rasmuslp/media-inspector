export enum FsObjectType {
	UNKNOWN,
	DIRECTORY,
	FILE
}

export abstract class FsObject {
	_fsObjectType: FsObjectType;
	_path: string;
	_stats: any;

	constructor(objectPath: string, stats) {
		this._fsObjectType = FsObjectType.UNKNOWN;
		this._path = objectPath;
		this._stats = {
			size: stats.size
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

	get isDirectory() {
		return this._fsObjectType === FsObjectType.DIRECTORY;
	}

	get isFile() {
		return this._fsObjectType === FsObjectType.FILE;
	}

	getPurges() {
		return [];
	}
}
