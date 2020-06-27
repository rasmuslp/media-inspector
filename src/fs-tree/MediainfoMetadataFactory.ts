import childProcess from 'child_process';
import util from 'util';

import * as mediainfoParser from 'mediainfo-parser';

import { MediainfoMetadata } from './MediainfoMetadata';
import { MetadataDataRaw, MetadataData } from './Metadata';

const exec = util.promisify(childProcess.exec);

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const parse = util.promisify(mediainfoParser.parse);

const mediainfoPath = 'mediainfo';

export class MediainfoMetadataFactory {
	static async _readFromFileSystem(path: string): Promise<MetadataDataRaw> {
		// execute
		const output = await exec(`${mediainfoPath} --Full --Output=XML "${path.replace(/`/g, '\\`')}"`);

		// Parse mediainfo output
		const parsed: MetadataDataRaw = await parse(output.stdout) as MetadataDataRaw;

		return parsed;
	}

	static async getFromFileSystem(path: string): Promise<MediainfoMetadata> {
		const metadata = await MediainfoMetadataFactory._readFromFileSystem(path);

		// Lets wrap that up
		const mediainfoMetadata = new MediainfoMetadata(metadata);

		return mediainfoMetadata;
	}

	static getFromSerialized(serialized: MetadataData): MediainfoMetadata {
		const mediainfoMetadata = new MediainfoMetadata(serialized.metadata);

		return mediainfoMetadata;
	}
}
