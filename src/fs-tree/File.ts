import {FsObject, FsObjectType} from './FsObject';
import {MediaFile} from "../MediaFile";

export class File extends FsObject {
	_mimeType: string;
	static _typeExtractor = /^([^/]+)/;

	constructor(objectPath, stats, mimeType: string) {
		super(objectPath, stats);
		this._fsObjectType = FsObjectType.FILE;
		this._mimeType = mimeType;
	}

	get type() {
		return File.getTypeFrom(this._mimeType);
	}

	static getTypeFrom(mimeType: string): string {
		const match = mimeType.match(File._typeExtractor);
		if (match) {
			const type = match[1];

			return type;
		}
	}
}
