import { Serializable } from './Serializable';
import { Serialized } from './Serialized';

export abstract class Metadata implements Serializable {
	_metadata: any;

	constructor(metadata) {
		this._metadata = metadata;
	}

	abstract get(path: string);

	serialize(): Serialized {
		return {
			instance: this.constructor.name,
			data: this.serializeData()
		}
	}

	serializeData() {
		return {
			metadata: this._metadata
		};
	}

	abstract deserialize(obj: Serialized);
}
