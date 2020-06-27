import * as t from 'io-ts';

import { Serializable, SerializableDataValidator } from './Serializable';

export const MetadataDataPartial = t.type({
	metadata: t.unknown
});

export const MetadataDataValidator = t.intersection([SerializableDataValidator, MetadataDataPartial]);

export type MetadataData = t.TypeOf<typeof MetadataDataValidator>;

export abstract class Metadata extends Serializable<MetadataData> {
	_metadata;

	constructor(metadata) {
		super();
		this._metadata = metadata;
	}

	abstract get(path: string);

	getDataForSerialization(): MetadataData {
		return {
			metadata: this._metadata
		};
	}
}
