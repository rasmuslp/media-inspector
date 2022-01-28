import childProcess from 'child_process';
import { promisify } from 'util';

import * as mediainfoParser from 'mediainfo-parser';

import {
	MediainfoMetadata,
	MediainfoMetadataRaw, MediainfoMetadataRawSchema,
	MediainfoMetadataSchema, MediainfoMetadataSerialized
} from './MediainfoMetadata';
import { SerializableSerialized } from '../../serializable/Serializable';

const exec = promisify(childProcess.exec);

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
const mediainfoParse = promisify(mediainfoParser.parse);

const mediainfoPath = 'mediainfo';

export class MediainfoMetadataFactory {
	static async readFromFileSystem(path: string): Promise<MediainfoMetadataRaw> {
		const output = await exec(`${mediainfoPath} --Full --Output=XML "${path.replace(/`/g, '\\`')}"`);

		// Parse mediainfo output
		const mediainfo: unknown = await mediainfoParse(output.stdout);

		// Can parse without throwing, then the full object - with any additional properties - can be returned
		MediainfoMetadataRawSchema.parse(mediainfo);

		return mediainfo as MediainfoMetadataRaw;
	}

	static async getFromFileSystem(path: string): Promise<MediainfoMetadata> {
		const metadata = await MediainfoMetadataFactory.readFromFileSystem(path);

		const mediainfoMetadata = new MediainfoMetadata(metadata);

		return mediainfoMetadata;
	}

	static getFromSerialized(serialized: SerializableSerialized): MediainfoMetadata {
		if (serialized.type === 'MediainfoMetadata') {
			// Can parse without throwing, then the full object - with any additional properties - can be returned
			MediainfoMetadataSchema.parse(serialized.data);
			const parsed = serialized.data as MediainfoMetadataSerialized;
			const mediainfoMetadata = new MediainfoMetadata(parsed.metadata);

			return mediainfoMetadata;
		}

		throw new Error(`MediainfoMetadataFactory cannot determine what this is: ${serialized.type}`);
	}
}
