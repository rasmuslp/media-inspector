const fsTree = require('./fs-tree');
const mediainfo = require('./mediainfo');

class MediaFile extends fsTree.File {
	constructor(objectPath, stats, type, mimeType) {
		super(objectPath, stats);

		this._type = type;
		this._mimeType = mimeType;
	}

	get type() {
		return this._type;
	}

	get metadata() {
		return this._metadata;
	}

	async fetchMetadata() {
		this._metadata = await mediainfo.read(this.path);

		return this.metadata;
	}
}

module.exports = MediaFile;
