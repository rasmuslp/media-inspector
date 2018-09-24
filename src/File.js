const FsObject = require('./FsObject');

class File extends FsObject {
	constructor(objectPath, stats) {
		super(objectPath, stats);
		this._type = 'file';
	}
}

module.exports = File;
