const childProcess = require('child_process');
const util = require('util');

const mediainfoParser = require('mediainfo-parser');

const MediainfoMetadata = require('./MediainfoMetadata');

const exec = util.promisify(childProcess.exec);
const parse = util.promisify(mediainfoParser.parse);

const mediainfoPath = 'mediainfo';

async function read(path) {
	// execute
	const output = await exec(`${mediainfoPath} --Full --Output=XML "${path}"`);

	// Parse mediainfo output
	const parsed = await parse(output.stdout);

	// Lets wrap that up
	const mediainfoMetadata = new MediainfoMetadata(parsed);

	return mediainfoMetadata;
}

module.exports = {
	read
};
