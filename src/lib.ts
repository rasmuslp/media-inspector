import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

import { filterLoader } from './filter';
import {FsTree, File, RecommendedPurge} from './fs-tree';

import { FilterRejectionPurge } from './filter/FilterRejectionPurge';

import { MediaFile } from './MediaFile';

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
	// @ts-ignore TODO
	const directory = await FsTree.read(directoryFullPath);

	// Filter
	if (logToConsole) {
		console.log(`Filtering...`);
	}
	// @ts-ignore
	let purges = await directory.getTreePurges({
		filtersByType,
		includeRecommended
	});
	if (logToConsole) {
		console.log(`Filtering completed. Found ${purges.length} item${purges.length === 1 ? 's' : ''} for purging`);
	}

	return {
		directory,
		purges
	};
}

function getLogMessageOfPurge(purge, { colorized = false } = {}) {
	let message = `${colorized ? chalk.yellow(purge.fsObject.path) : purge.fsObject.path}\n\t`;

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

	switch (purge.constructor) {
		case FilterRejectionPurge:
		case RecommendedPurge: {
			message += purge.getPurgeReason({ colorized });
			break;
		}

		default:
			message += `${purge.message ? purge.message : 'Error'}: ${JSON.stringify(purge)}`;
	}

	return message + '\n';
}

async function scan({ directoryPath, filterPath, includeRecommended = false }) {
	const { directory, purges } = await preProcess({ directoryPath, filterPath, includeRecommended, logToConsole: true });

	// Log purges with reasons
	for (const purge of purges) {
		const message = getLogMessageOfPurge(purge, { colorized: true });
		console.log(message);
	}

	const spaceFreeable = purges
		.map(purge => purge.fsObject.size)
		.reduce((acc, cur) => (acc += cur), 0);

	console.log('Space freeable: ', spaceFreeable);

	// @ts-ignore
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

export {
	scan,
	list,
	remove
};
