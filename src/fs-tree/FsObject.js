class FsObject {
	constructor(objectPath, stats) {
		this._path = objectPath;
		this._stats = {
			size: stats.size
		};
	}

	get path() {
		return this._path;
	}

	get parent() {
		return this._parent;
	}

	get children() {
		return [];
	}

	get size() {
		return this._stats.size;
	}

	get isDirectory() {
		return this._fsObjectType === 'directory';
	}

	get isFile() {
		return this._fsObjectType === 'file';
	}

	getPruneList() {
		return [];
	}
}

module.exports = FsObject;
