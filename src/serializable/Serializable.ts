import * as t from 'io-ts';

/**
 * NB: While declared optional, Serializable ensures that it will always be added on serialization
 */
export const TSerializable = t.type({
	type: t.string
});

export type SerializableData = t.TypeOf<typeof TSerializable>;

export abstract class Serializable<T extends SerializableData = SerializableData> {
	data: Partial<T>;

	constructor(data?: Partial<T>) {
		this.data = {
			...this.data,
			...data
		};
	}

	serialize(): T {
		return {
			...this.data,
			...this.getDataForSerialization(),
			type: this.constructor.name // Override to ensure it has not been changed by accident
		} as T;
	}

	getDataForSerialization(): Partial<T> {
		return {};
	}
}
