import { z } from 'zod';

export const SerializableSchema = z.object({
	type: z.string(),
	data: z.any()
});

export type SerializableSerialized = z.infer<typeof SerializableSchema>;

export abstract class Serializable<T> {
	serialize(): SerializableSerialized {
		return {
			type: this.constructor.name,
			data: this.getDataForSerialization()
		};
	}

	abstract getDataForSerialization(): T;
}
