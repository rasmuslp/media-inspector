import { File } from './File';
import { Metadata } from './Metadata';

export abstract class MediaFile extends File {
	_metadata: Metadata;

	constructor(objectPath, stats, mimeType, metadata: Metadata) {
		super(objectPath, stats, mimeType);
		this._metadata = metadata;
	}

	get metadata() {
		return this._metadata;
	}
}
