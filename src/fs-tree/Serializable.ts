import * as t from 'io-ts';

/**
 * NB: While declared optional, Serializable ensures that it will always be added on serialization
 */
export const SerializableDataValidator = t.partial({
	type: t.string
});

export type SerializableData = t.TypeOf<typeof SerializableDataValidator>;

export abstract class Serializable<T extends SerializableData> {
	serialize(): T {
		return {
			type: this.constructor.name,
			...this.getDataForSerialization()
		};
	}

	abstract getDataForSerialization(): T;
}
