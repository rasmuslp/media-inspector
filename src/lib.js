const fs = require('fs');
const path = require('path');

const mime = require('mime-types');

const { filterLoader } = require('./filter');
const fsTree = require('./fs-tree');

const FilterRejectionError = require('./FilterRejectionError');

const MediaFile = require('./MediaFile');

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

async function preProcess({ directoryPath, filterPath, includeRecommended, logToConsole = false }) {
	// Build full paths
	const directoryFullPath = path.resolve(process.cwd(), directoryPath);
	const filterFullPath = path.resolve(process.cwd(), filterPath);

	// Load filters
	const filtersByType = await filterLoader(filterFullPath);

	if (logToConsole) {
		const bootMessage = `
media-purger starting up
scanning directory at ${directoryFullPath}
with filter at ${filterFullPath}
${includeRecommended ? 'including recommended' : ''}
`;
		console.log(bootMessage);
	}

	// Scan directory structure
	if (logToConsole) {
		console.log(`Scanning files and directories...`);
	}
	const directory = await fsTree.build(directoryFullPath, undefined, fileBuilder);

	// Filter
	if (logToConsole) {
		console.log(`Filtering...`);
	}
	let purges = await directory.getTreePurges({
		filtersByType,
		includeRecommended
	});
	if (logToConsole) {
		console.log(`Filtering completed. Found ${purges.length} item${purges.length === 1 ? 's' : ''} for purging`);
	}

	// TODO FIX/IMPROVE: Ensure nothing was marked twice, that would be a bug!
	const uniquePaths = new Set();
	for (const purge of purges) {
		uniquePaths.add(purge.fsObject.path);
	}

	if (uniquePaths.size !== purges.length) {
		console.error('Stop stop! Duplicates detected!');
		process.exit(-1);
	}

	return {
		directory,
		purges
	};
}

function getLogMessageOfPurge(purge) {
	let message = `${purge.fsObject.path}\n\t`;

	if (purge.fsObject.isDirectory) {
		message += `[Directory]`;
	}
	else if (purge.fsObject instanceof MediaFile) {
		message += `[Media file]`;
	}
	else {
		message += `[File]`;
	}

	message += ' ';

	switch (purge.reason.constructor) {
		case FilterRejectionError:
		case fsTree.RecommendedPurgeError: {
			message += purge.reason.getPurgeReason();
			break;
		}

		default:
			message += `${purge.reason.message ? purge.reason.message : 'Error'}: ${JSON.stringify(purge.reason)}`;
	}

	return message;
}

async function scan({ directoryPath, filterPath, includeRecommended = false }) {
	const { directory, purges } = await preProcess({ directoryPath, filterPath, includeRecommended, logToConsole: true });

	// Log purges with reasons
	for (const purge of purges) {
		const message = getLogMessageOfPurge(purge);
		console.log(message);
	}

	const spaceFreeable = purges
		.map(purge => purge.fsObject.size)
		.reduce((acc, cur) => (acc += cur), 0);

	console.log('Space freeable: ', spaceFreeable);

	const size = await directory.getSizeOfTree();
	console.log('Total Size: ', size);

	const reduction = spaceFreeable / size * 100;
	console.log(`Reduction: ${reduction.toFixed(2)}%`);
}

async function list({ directoryPath, filterPath, includeRecommended = false }) {
	const { purges } = await preProcess({ directoryPath, filterPath, includeRecommended });

	// List purges
	for (const purge of purges) {
		console.log(purge.fsObject.path);
	}
}

async function remove({ directoryPath, filterPath, includeRecommended = false, dryRun = true, skipLog = false }) {
	const { purges } = await preProcess({ directoryPath, filterPath, includeRecommended });

	// Let the purge begin!
	const logFileFullPath = path.join(process.cwd(), `media-purger-${Date.now()}.log`);
	for (const purge of purges) {
		// Build a log message of the purge
		let message = getLogMessageOfPurge(purge);

		console.log(message);

		// If not skip log, write intent to log before performing removal
		if (!skipLog) {
			try {
				fs.appendFileSync(logFileFullPath, message + '\n');
			}
			catch (e) {
				console.error(`Could not write log:`, e);
				process.exit(-1);
			}
		}

		// Remove
		if (!dryRun) {
			try {
				if (purge.fsObject.isDirectory) {
					fs.rmdirSync(purge.fsObject.path);
				}
				else if (purge.fsObject.isFile) {
					fs.unlinkSync(purge.fsObject.path);
				}
				else {
					console.log(`Err, dunno? ${purge.fsObject.path}`);
				}
			}
			catch (e) {
				console.error(`Could not unlink: ${purge.fsObject.path}`, e);
				process.exit(-1);
			}
		}
	}
}

module.exports = {
	scan,
	list,
	remove
};
