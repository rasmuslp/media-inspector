const path = require('path');

const commander = require('commander');
const mime = require('mime-types');

const fsTree = require('./fs-tree');

const MediaFile = require('./MediaFile');

const packageJson = require(path.join(__dirname, '..', 'package.json'));

commander
	.version(packageJson.version)
	.option('-n, --dry-run', `don't actually perform any actions`)
	.option('-f, --filter [path]', 'filter configuration file in JSON or JavaScript')
	.parse(process.argv);

const directories = commander.args;
if (!(directories.length)) {
	console.error('media-pruner needs to know where to scan');
}

if (!commander.filter) {
	console.error('media-pruner needs a filter');
}
const filterPath = path.join(process.cwd(), commander.filter);

const loadedFilters = require(filterPath);

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

async function run(directoryPath, filters) {
	console.log(`media-pruner scanning ${directoryPath}`);

	const dir = await fsTree.build(directoryPath, undefined, fileBuilder);

	const videoFiles = await dir.findInTree(node => {
		return node.isFile && node.type === 'video';
	});
	console.log(`Found ${videoFiles.length} video files`);

	console.log('Filtering video files...');
	const start = Date.now();
	const infoForFiles = [];
	const matchedFiles = [];
	const rejectedFiles = [];
	for (const videoFile of videoFiles) {
		try {
			const info = await videoFile.fetchMetadata();
			infoForFiles.push(info);

			const type = videoFile.type; // Always 'video'
			try {
				videoFile.passAnyFilter(filters[type]);
				matchedFiles.push(videoFile);
			}
			catch (e) {
				// Rejected
				rejectedFiles.push({
					file: videoFile,
					error: e
				});
			}
		}
		catch (e) {
			console.log(videoFile.path, e);
		}
	}

	console.log(`Filtering completed in ${Date.now() - start} ms`);
	console.log(`Matched files (${matchedFiles.length})`);
	console.log(`Rejected files (${rejectedFiles.length})`);
	console.log(JSON.stringify(rejectedFiles.map(({ file, error }) => ({
		path: file.path,
		rejection: error.reasons
	}))));

	const size = await dir.getSizeOfTree();
	console.log('Total Size: ', size);
}

run(directories[0], loadedFilters);
