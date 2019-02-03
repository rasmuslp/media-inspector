import { Serialized } from './Serialized';

export interface Serializable {
	serialize(): Serialized;

	serializeData();

	deserialize(obj: Serialized);
}
