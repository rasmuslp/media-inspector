import { z } from 'zod';

export const SerializableSchema = z.object({
	type: z.string()
});

export type SerializableData = z.infer<typeof SerializableSchema>;

export abstract class Serializable<T extends SerializableData> {
	readonly data: T;

	constructor(data?: T) {
		this.data = {
			...data
		};
	}

	serialize(): T {
		return {
			...this.data,
			...this.getDataForSerialization(),
			type: this.constructor.name
		};
	}

	getDataForSerialization(): Record<string, unknown> {
		return {};
	}
}
