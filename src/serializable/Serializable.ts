import * as t from 'io-ts';

/**
 * NB: While declared optional, Serializable ensures that it will always be added on serialization
 */
export const TSerializable = t.type({
	type: t.string
});

export type SerializableData = t.TypeOf<typeof TSerializable>;

export abstract class Serializable<T extends SerializableData> {
	data: Partial<T>;

	protected constructor() {
		this.data = {};
		this.data.type = this.constructor.name;
	}

	serialize(): T {
		return {
			...this.data,
			...(this.getDataForSerialization ? this.getDataForSerialization() : {}),
			type: this.constructor.name // Override to ensure it has not been changed by accident
		} as T;
	}

	getDataForSerialization(): T|void {
		// Empty, but we shouldn't end up here..
	}
}
