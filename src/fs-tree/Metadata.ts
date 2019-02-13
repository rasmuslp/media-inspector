import { Serializable } from './Serializable';
import { Serialized } from './Serialized';

export interface MetadataData {
	metadata;
}

export abstract class Metadata implements Serializable {
	_metadata;

	constructor(metadata) {
		this._metadata = metadata;
	}

	abstract get(path: string);

	serialize(): Serialized<MetadataData> {
		return {
			instance: this.constructor.name,
			data: this.serializeData()
		};
	}

	serializeData(): MetadataData {
		return {
			metadata: this._metadata
		};
	}
}
