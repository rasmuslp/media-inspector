import {FsObject, FsObjectType} from './FsObject';

export class File extends FsObject {
	constructor(objectPath, stats) {
		super(objectPath, stats);
		this._fsObjectType = FsObjectType.FILE;
	}
}
