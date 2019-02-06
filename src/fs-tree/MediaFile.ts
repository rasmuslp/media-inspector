import {File, SerializedFileData} from './File';
import { Metadata } from './Metadata';
import {Serialized} from './Serialized';

export interface SerializedMediaFileData extends SerializedFileData {
	metadata: object
}

export abstract class MediaFile extends File {
	_metadata: Metadata;

	constructor(nodePath, stats, mimeType, metadata?: Metadata) {
		super(nodePath, stats, mimeType);
		this._metadata = metadata;
	}

	get metadata() {
		return this._metadata;
	}

	set metadata(metadata: Metadata) {
		this._metadata = metadata;
	}

	abstract async readMetadataFromFileSystem();

	serialize(): Serialized<SerializedMediaFileData> {
		return {
			instance: this.constructor.name,
			data: this.serializeData()
		};
	}

	serializeData(): SerializedMediaFileData {
		return Object.assign({}, super.serializeData(), {
			metadata: this._metadata.serialize()
		});
	}
}
