import * as t from 'io-ts';

export const SerializableDataValidator = t.type({
	type: t.string
});

export type SerializableData = t.TypeOf<typeof SerializableDataValidator>;

export abstract class Serializable {
	serialize(): object {
		return {
			type: this.constructor.name,
			...this.serializeData()
		};
	}

	abstract serializeData();
}
