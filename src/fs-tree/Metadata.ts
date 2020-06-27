import * as t from 'io-ts';

import { Serializable, TSerializable } from './Serializable';

export const TMetadataDataRaw = t.type({
	media: t.record(t.string, t.UnknownRecord)
});
export type MetadataDataRaw = t.TypeOf<typeof TMetadataDataRaw>;

export const TMetadataPartial = t.type({
	metadata: TMetadataDataRaw
});

export const TMetadata = t.intersection([TSerializable, TMetadataPartial]);
export type MetadataData = t.TypeOf<typeof TMetadata>;

export abstract class Metadata extends Serializable<MetadataData> {
	constructor(metadata: MetadataDataRaw) {
		super();
		this.data.metadata = metadata;
	}

	abstract get(path: string): string;
}
