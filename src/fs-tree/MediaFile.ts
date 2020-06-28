import * as t from 'io-ts';

import { File, TFile } from './File';
import { Metadata, TMetadata } from './Metadata';
import { FsNodeStats } from './FsNode';

const TMediaFilePartial = t.type({
	metadata: TMetadata
});

export const TMediaFile = t.intersection([TFile, TMediaFilePartial]);
export type MediaFileData = t.TypeOf<typeof TMediaFile>;

export abstract class MediaFile extends File<MediaFileData> {
	_metadata: Metadata;

	constructor(nodePath: string, stats: FsNodeStats, mimeType: string, metadata?: Metadata) {
		super(nodePath, stats, mimeType);
		this._metadata = metadata;
	}

	get metadata(): Metadata {
		return this._metadata;
	}

	set metadata(metadata: Metadata) {
		this._metadata = metadata;
	}

	abstract async readMetadataFromFileSystem(): Promise<void>;

	getDataForSerialization(): MediaFileData {
		return {
			metadata: this._metadata.serialize()
		} as unknown as MediaFileData;
	}
}
