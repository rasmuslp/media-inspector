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

	get type() {
		return this._type;
	}

	get size() {
		return this._stats.size;
	}

	get isDirectory() {
		return this._type === 'directory';
	}

	get isFile() {
		return this._type === 'file';
	}
}

module.exports = FsObject;
