import fs from 'fs';
import { promisify } from 'util';

import * as t from 'io-ts';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

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

	static isSerializePath(serializePath: string): boolean {
		return serializePath.endsWith('.json');
	}

	static async write(serializable: Serializable, writePath: string): Promise<void> {
		const serialized = {
			metadata: {
				createdAt: Date.now()
			},
			data: serializable.serialize()
		};
		const json = JSON.stringify(serialized, undefined, 4);

		return await writeFile(writePath, json, 'utf8');
	}

	static async read(serializedPath: string): Promise<{data: SerializableData}> {
		const fileContent = await readFile(serializedPath, 'utf8');
		const parsed = JSON.parse(fileContent) as {data: SerializableData};
		return parsed;
	}
}
