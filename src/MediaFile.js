const fsTree = require('./fs-tree');

class MediaFile extends fsTree.File {
	constructor(objectPath, stats, type, mimeType) {
		super(objectPath, stats);

		this._type = type;
		this._mimeType = mimeType;
	}

	get type() {
		return this._type;
	}
}

module.exports = MediaFile;
