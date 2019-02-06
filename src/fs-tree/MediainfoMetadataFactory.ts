import childProcess from 'child_process';
import util from 'util';

import * as mediainfoParser from 'mediainfo-parser';

import { MediainfoMetadata } from './MediainfoMetadata';

const exec = util.promisify(childProcess.exec);
const parse = util.promisify(mediainfoParser.parse);

const mediainfoPath = 'mediainfo';

export class MediainfoMetadataFactory {
	static async _readFromFileSystem(path) {
		// execute
		const output = await exec(`${mediainfoPath} --Full --Output=XML "${path.replace(/`/g, '\\`')}"`);

		// Parse mediainfo output
		const parsed = await parse(output.stdout);

		return parsed;
	}

	static async getFromFileSystem(path) {
		const metadata = await MediainfoMetadataFactory._readFromFileSystem(path);

		// Lets wrap that up
		const mediainfoMetadata = new MediainfoMetadata(metadata);

		return mediainfoMetadata;
	}

	static createFromSerialized(serialized) {
		const mediainfoMetadata = new MediainfoMetadata(serialized.data);

		return mediainfoMetadata;
	}
}
