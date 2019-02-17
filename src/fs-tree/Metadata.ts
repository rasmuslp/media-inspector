import * as t from 'io-ts';

import { Serializable } from './Serializable';

export const MetadataDataValidator = t.type({
	metadata: t.unknown
});

export type MetadataData = t.TypeOf<typeof MetadataDataValidator>;

export abstract class Metadata extends Serializable {
	_metadata;

	constructor(metadata) {
		super();
		this._metadata = metadata;
	}

	abstract get(path: string);

	serializeData(): object {
		return {
			metadata: this._metadata
		};
	}
}
