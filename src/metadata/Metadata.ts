import * as t from 'io-ts';

import { Serializable, TSerializable } from '../serializable/Serializable';

export const TMiTrack = t.type({
	_type: t.string
});

export const TMiMetadataRaw = t.type({
	media: t.record(t.string, t.array(TMiTrack))
});
export type MiMetadataRaw = t.TypeOf<typeof TMiMetadataRaw>;

export const TMiMetadataPartial = t.type({
	metadata: TMiMetadataRaw
});

export const TMiMetadata = t.intersection([TSerializable, TMiMetadataPartial]);
export type MiMetadataData = t.TypeOf<typeof TMiMetadata>;

// TODO: Make Metadata class extend different kind of metadata
export const TMetadata = TMiMetadata;
export type MetadataData = MiMetadataData;

export abstract class Metadata extends Serializable<MetadataData> {
	constructor(metadata: MiMetadataRaw) {
		super();
		this.data.metadata = metadata;
	}

	abstract get(path: string): string;
}
