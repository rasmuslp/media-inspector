import * as t from 'io-ts';

import { Serializable, SerializableDataValidator } from './Serializable';

export const MetadataDataPartial = t.type({
	metadata: t.unknown
});

export const MetadataDataValidator = t.intersection([SerializableDataValidator, MetadataDataPartial]);

export type MetadataData = t.TypeOf<typeof MetadataDataValidator>;

export abstract class Metadata extends Serializable<MetadataData> {
	constructor(metadata: unknown) {
		super();
		this.data.metadata = metadata;
	}

	abstract get(path: string);
}
