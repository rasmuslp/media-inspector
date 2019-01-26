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
		// @ts-ignore TODO Why does these even exist here?
		return this._fsObjectType === 'directory';
	}

	get isFile() {
		// @ts-ignore TODO Why does these even exist here?
		return this._fsObjectType === 'file';
	}

	getPurges() {
		return [];
	}
}

module.exports = FsObject;
