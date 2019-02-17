import * as t from 'io-ts';

import { File, FileDataValidator } from './File';
import { Metadata } from './Metadata';

const MediaFileDataPartial = t.type({
	metadata: t.unknown
});

export const MediaFileDataValidator = t.intersection([FileDataValidator, MediaFileDataPartial]);

export type MediaFileData = t.TypeOf<typeof MediaFileDataValidator>;

export abstract class MediaFile extends File {
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

	serializeData(): object {
		const data = Object.assign(super.serializeData(), {
			metadata: this._metadata.serialize()
		});

		return data;
	}
}
