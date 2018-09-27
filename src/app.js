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

const filter = require(filterPath);

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

function fileMatchesFilter(mediaFile, filters) {
	const type = mediaFile.type;
	if (!(type in filters)) {
		return false;
	}

	for (const filter of filters[type]) {
		// All conditions must be met
		for (const [trackType, conditions] of Object.entries(filter)) {
			for (const [property, condition] of Object.entries(conditions)) {
				const value = mediaFile.metadata.get(trackType, property);
				switch (condition.comparator) {
					case 'string': {
						if (!(value.toLocaleLowerCase() === condition.value.toLocaleLowerCase())) {
							return false;
						}

						break;
					}
					case '>=': {
						if (!(value >= condition.value)) {
							// We didn't meet the condition
							return false;
						}

						break;
					}

					default:
						throw new Error(`Unknown comparator '${condition.comparator}'`);
				}
			}
		}
	}

	return true;
}

async function run(directoryPath) {
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
	const unmatchedFiles = [];
	for (const videoFile of videoFiles) {
		try {
			const info = await videoFile.fetchMetadata();
			infoForFiles.push(info);

			if (fileMatchesFilter(videoFile, filter)) {
				matchedFiles.push(videoFile);
			}
			else {
				unmatchedFiles.push(videoFile);
			}
		}
		catch (e) {
			console.log(videoFile.path, e);
		}
	}

	console.log(`Filtering completed in ${Date.now() - start} ms`);
	console.log(`Matched files (${matchedFiles.length})`);
	console.log(`Unmatched files (${unmatchedFiles.length})`);
	console.log(JSON.stringify(unmatchedFiles.map(file => file.path)));

	const size = await dir.getSizeOfTree();
	console.log('Total Size: ', size);
}

run(directories[0]);
