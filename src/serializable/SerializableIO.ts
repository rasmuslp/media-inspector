import fs from 'fs';
import { promisify } from 'util';

import { Serializable } from './Serializable';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export class SerializableIO {
	static isSerializePath(serializePath: string): boolean {
		return serializePath.endsWith('.json');
	}

	static async write(serializable: Serializable<unknown>, writePath: string): Promise<void> {
		const serialized = {
			metadata: {
				createdAt: Date.now()
			},
			data: serializable.serialize()
		};
		const json = JSON.stringify(serialized, undefined, 4);

		return await writeFile(writePath, json, 'utf8');
	}

	static async read(serializedPath: string): Promise<{data: unknown}> {
		const fileContent = await readFile(serializedPath, 'utf8');
		const parsed = JSON.parse(fileContent) as {data: unknown};
		return parsed;
	}
}
