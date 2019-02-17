import childProcess from 'child_process';
import util from 'util';

import * as mediainfoParser from 'mediainfo-parser';

import { MediainfoMetadata } from './MediainfoMetadata';
import { MetadataData } from './Metadata';

const exec = util.promisify(childProcess.exec);
const parse = util.promisify(mediainfoParser.parse);

const mediainfoPath = 'mediainfo';

export class MediainfoMetadataFactory {
	static async _readFromFileSystem(path): Promise<object> {
		// execute
		const output = await exec(`${mediainfoPath} --Full --Output=XML "${path.replace(/`/g, '\\`')}"`);

		// Parse mediainfo output
		const parsed = await parse(output.stdout);

		return parsed;
	}

	static async getFromFileSystem(path): Promise<MediainfoMetadata> {
		const metadata = await MediainfoMetadataFactory._readFromFileSystem(path);

		// Lets wrap that up
		const mediainfoMetadata = new MediainfoMetadata(metadata);

		return mediainfoMetadata;
	}

	static getFromSerialized(serialized): MediainfoMetadata {
		const data = serialized as MetadataData;
		const mediainfoMetadata = new MediainfoMetadata(data.metadata);

		return mediainfoMetadata;
	}
}
