import { Serializable } from './Serializable';
import { Serialized } from './Serialized';

export enum FsObjectType {
	UNKNOWN,
	DIRECTORY,
	FILE
}

export abstract class FsObject implements Serializable {
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

	isDirectory() {
		return this._fsObjectType === FsObjectType.DIRECTORY;
	}

	isFile() {
		return this._fsObjectType === FsObjectType.FILE;
	}

	serialize(): Serialized {
		return {
			instance: this.constructor.name,
			data: this.serializeData()
		}
	}

	serializeData() {
		return {
			fsObjectType: this._fsObjectType,
			path: this._path,
			_stats: Object.assign({}, this._stats)
		};
	}

	abstract deserialize(obj: Serialized);
}
