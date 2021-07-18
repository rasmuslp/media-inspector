import childProcess from 'child_process';
import { promisify } from 'util';

import * as mediainfoParser from 'mediainfo-parser';

import { MediainfoMetadata, MediainfoMetadataData, MiMetadataRaw } from './MediainfoMetadata';

const exec = promisify(childProcess.exec);

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const parse = promisify(mediainfoParser.parse);

const mediainfoPath = 'mediainfo';

export class MediainfoMetadataFactory {
	static async _readFromFileSystem(path: string): Promise<MiMetadataRaw> {
		// execute
		const output = await exec(`${mediainfoPath} --Full --Output=XML "${path.replace(/`/g, '\\`')}"`);

		// Parse mediainfo output
		const parsed = await parse(output.stdout) as MiMetadataRaw;

		return parsed;
	}

	static async getFromFileSystem(path: string): Promise<MediainfoMetadata> {
		const metadata = await MediainfoMetadataFactory._readFromFileSystem(path);

		// Lets wrap that up
		const mediainfoMetadata = new MediainfoMetadata(metadata);

		return mediainfoMetadata;
	}

	static getFromSerialized(serialized: MediainfoMetadataData): MediainfoMetadata {
		const mediainfoMetadata = new MediainfoMetadata(serialized.metadata);

		return mediainfoMetadata;
	}
}
