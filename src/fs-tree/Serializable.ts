import { Serialized } from './Serialized';

export abstract class Serializable {
	abstract serialize(): Serialized;

	abstract serializeData();
}
