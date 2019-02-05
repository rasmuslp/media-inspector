import { Serializable } from './Serializable';
import { Serialized } from './Serialized';

export enum FsNodeType {
	UNKNOWN,
	DIRECTORY,
	FILE
}

export abstract class FsNode implements Serializable {
	_fsNodeType: FsNodeType;
	_path: string;
	_stats: any;

	constructor(objectPath: string, stats) {
		this._fsNodeType = FsNodeType.UNKNOWN;
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

	isDirectory() {
		return this._fsNodeType === FsNodeType.DIRECTORY;
	}

	isFile() {
		return this._fsNodeType === FsNodeType.FILE;
	}

	serialize(): Serialized {
		return {
			instance: this.constructor.name,
			data: this.serializeData()
		}
	}

	serializeData() {
		return {
			path: this._path,
			stats: Object.assign({}, this._stats)
		};
	}

	abstract deserialize(obj: Serialized);
}
