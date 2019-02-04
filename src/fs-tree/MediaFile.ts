import { File } from './File';
import { Metadata } from './Metadata';

export abstract class MediaFile extends File {
	_metadata: Metadata;

	constructor(objectPath, stats, mimeType, metadata?: Metadata) {
		super(objectPath, stats, mimeType);
		this._metadata = metadata;
	}

	get metadata() {
		return this._metadata;
	}

	set metadata(metadata: Metadata) {
		this._metadata = metadata;
	}

	abstract async readMetadataFromFileSystem();

	serializeData() {
		const superData = super.serializeData();
		return Object.assign(superData, {
			metadata: this._metadata.serialize()
		});
	}
}
