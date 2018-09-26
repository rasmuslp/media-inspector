const path = require('path');

const commander = require('commander');
const mime = require('mime-types');

const fsTree = require('./fs-tree');

const MediaFile = require('./MediaFile');
const mediainfo = require('./mediainfo');

const packageJson = require(path.join(__dirname, '..', 'package.json'));

commander
	.version(packageJson.version)
	.option('-n, --dry-run', `Don't actually perform any actions`)
	.parse(process.argv);

const directories = commander.args;
if (!(directories.length)) {
	console.error('media-pruner needs to know where to scan');
}

const typeExtractor = /^([^/]+)/;
const mediaTypes = [
	'image',
	'video'
];

function fileBuilder(objectPath, stats) {
	const mimeType = mime.lookup(objectPath);
	if (mimeType) {
		const match = mimeType.match(typeExtractor);
		if (match) {
			const type = match[1];
			if (mediaTypes.includes(type)) {
				return new MediaFile(objectPath, stats, type, mimeType);
			}
		}
		else {
			console.log(`Could not extract type from ${mimeType}`);
		}
	}

	return new fsTree.File(objectPath, stats);
}

async function run(directoryPath) {
	console.log(`media-pruner scanning ${directoryPath}`);

	const dir = await fsTree.build(directoryPath, undefined, fileBuilder);
	console.log('Dir:', dir);

	const videoFiles = await dir.findInTree(node => {
		return node.isFile && node.type === 'video';
	});
	console.log('Files:', videoFiles);

	console.log('Reading mediainfo for video files...');
	for (const videoFile of videoFiles) {
		try {
			const info = await mediainfo.read(videoFile.path);
			console.log(videoFile.path, info);
		}
		catch (e) {
			console.log(videoFile.path, e);
		}
	}

	const size = await dir.getSizeOfTree();
	console.log('Total Size: ', size);
}

run(directories[0]);
