import childProcess from 'child_process';
import util from 'util';

import * as mediainfoParser from 'mediainfo-parser';

import { MediainfoMetadata } from './MediainfoMetadata';

const exec = util.promisify(childProcess.exec);
const parse = util.promisify(mediainfoParser.parse);

const mediainfoPath = 'mediainfo';

async function read(path) {
	// execute
	const output = await exec(`${mediainfoPath} --Full --Output=XML "${path.replace(/`/g, '\\`')}"`);

	// Parse mediainfo output
	const parsed = await parse(output.stdout);

	return parsed;
}

async function getMetadata(path) {
	const metadata = await read(path);

	// Lets wrap that up
	const mediainfoMetadata = new MediainfoMetadata(metadata);

	return mediainfoMetadata;
}

export {
	MediainfoMetadata,

	read,
	getMetadata
};
