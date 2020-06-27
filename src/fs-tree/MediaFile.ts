import * as t from 'io-ts';

import { File, FileDataValidator } from './File';
import { Metadata } from './Metadata';

const MediaFileDataPartial = t.type({
	metadata: t.unknown
});

export const MediaFileDataValidator = t.intersection([FileDataValidator, MediaFileDataPartial]);

export type MediaFileData = t.TypeOf<typeof MediaFileDataValidator>;

export abstract class MediaFile extends File<MediaFileData> {
	_metadata: Metadata;

	constructor(nodePath, stats, mimeType, metadata?: Metadata) {
		super(nodePath, stats, mimeType);
		this._metadata = metadata;
	}

	get metadata(): Metadata {
		return this._metadata;
	}

	set metadata(metadata: Metadata) {
		this._metadata = metadata;
	}

	abstract async readMetadataFromFileSystem();

	getDataForSerialization(): MediaFileData {
		return {
			metadata: this._metadata.serialize()
		} as MediaFileData;
	}
}
