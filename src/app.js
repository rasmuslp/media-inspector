const fs = require('fs');
const path = require('path');

const commander = require('commander');
const mime = require('mime-types');

const fsTree = require('./fs-tree');

const FilterRejectionError = require('./FilterRejectionError');
const RecommendedPurgeError = require('./RecommendedPurgeError');

const MediaFile = require('./MediaFile');

const packageJson = require(path.join(__dirname, '..', 'package.json'));

commander
	.version(packageJson.version)
	.option('-f, --filter [path]', 'filter configuration file in JSON or JavaScript')
	.option('--include-recommended', `will also include empty directories and 'container' folders`)
	.option('--skip-log', `don't write history in current working directory`)
	.parse(process.argv);

// Extract mime 'master' type of the full mime type
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
			console.log(`Could not extract type from ${mimeType} at ${objectPath}`);
		}
	}

	return new fsTree.File(objectPath, stats);
}

async function run({ filterPath, includeRecommended, skipLog = false, directory } = {}) {
	if (!directory) {
		console.error('media-purger needs to know where to scan');
		process.exit(-1);
	}

	if (!filterPath) {
		console.error('media-purger needs a filter');
		process.exit(-1);
	}

	// Load filter
	const filterFullPath = path.resolve(process.cwd(), filterPath);
	const loadedFilters = require(filterFullPath);

	const directoryFullPath = path.resolve(process.cwd(), directory);

	const bootMessage = `
media-purger starting up
scanning directory at ${directoryFullPath}
with filter at ${filterFullPath}
${includeRecommended ? 'including recommended' : ''}
`;
	console.log(bootMessage);

	// Scan
	console.log(`Scanning files and directories...`);
	const dir = await fsTree.build(directoryFullPath, undefined, fileBuilder);

	// Filter
	console.log(`Filtering...`);
	const start = Date.now();
	let purges = await dir.getTreePurges({
		filtersByType: loadedFilters,
		includeRecommended
	});
	console.log(`Filtering completed. Found ${purges.length} item${purges.length === 1 ? 's' : ''} for purging (${Date.now() - start} ms)`);

	const uniquePaths = new Set();
	for (const purge of purges) {
		uniquePaths.add(purge.fsObject.path);
	}

	if (uniquePaths.size !== purges.length) {
		console.log('Stop stop! Duplicates detected!');
		process.exit(-1);
	}

	// Keep log of reasons for writing to disk;
	const logMessages = [];

	console.log(`Listing files for purging:`);
	for (const item of purges) {
		let message = `${item.fsObject.path}\n\t`;

		if (item.fsObject.isDirectory) {
			message += `[Directory]`;
		}
		else if (item.fsObject instanceof MediaFile) {
			message += `[Media file]`;
		}
		else {
			message += `[File]`;
		}

		message += ' ';

		switch (item.reason.constructor) {
			case FilterRejectionError:
			case RecommendedPurgeError: {
				message += item.reason.getPurgeReason();
				break;
			}

			default:
				message += `${item.reason.message ? item.reason.message : 'Error'}: ${JSON.stringify(item.reason)}`;
		}

		logMessages.push(message);
		console.log(message);
	}

	const spaceFreeable = purges
		.map(item => item.fsObject.size)
		.reduce((acc, cur) => (acc += cur), 0);

	console.log('Space freeable: ', spaceFreeable);

	const size = await dir.getSizeOfTree();
	console.log('Total Size: ', size);

	const reduction = spaceFreeable / size * 100;
	console.log(`Reduction: ${reduction.toFixed(2)}%`);

	const doDelete = true;
	if (doDelete) {
		if (!skipLog) {
			try {
				fs.appendFileSync(path.join(process.cwd(), `media-purger-${Date.now()}.log`), logMessages.join('\n'));
			}
			catch (e) {
				console.error(`Could not write log:`, e);
				process.exit(-1);
			}
		}
	}

	console.log('Done');
}

run({
	filterPath: commander.filter,
	includeRecommended: commander.includeRecommended,
	skipLog: commander.skipLog,
	directory: commander.args[0]
});
