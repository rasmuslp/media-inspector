import path from 'path';

import chalk from 'chalk';

import { FilterFactory } from './filter';
import {FsTree, File, MediaFile, FsObject} from './fs-tree';

import { FilterMatchPurge } from './purge/FilterMatchPurge';
import { RecommendedPurge } from './purge/RecommendedPurge';

import { FilterMatcher } from './FilterMatcher';

export interface libOptions {
	directoryPath: string,
	filterPath?: string,
	includeRecommended?: boolean,
	verbose?: boolean
}

export async function run(options: libOptions) {
	const directory = await readPath(options.directoryPath, options.verbose);

	const purges = [];

	if (options.filterPath) {
		const filterMatchPurges = await filter(directory, options.filterPath, options.verbose);
		purges.push(...filterMatchPurges);
	}

	for (const purge of purges) {
		if (options.verbose) {
			const message = getLogMessageOfPurge(purge, { colorized: true });
			console.log(message);
		}
		else {
			console.log(purge.fsObject.path);
		}
	}

	if (options.verbose) {
		const spaceFreeable = purges
			.map(purge => purge.fsObject.size)
			.reduce((acc, cur) => (acc += cur), 0);

		console.log('Space freeable: ', spaceFreeable);

		// @ts-ignore
		const size = await FsTree.getSize(directory);
		console.log('Total Size: ', size);

		const reduction = spaceFreeable / size * 100;
		console.log(`Reduction: ${reduction.toFixed(2)}%`);
	}
}

async function readPath(nodePath: string, verbose: boolean = false, outputPath?: string) {
	const absoluteNodePath = path.resolve(process.cwd(), nodePath);
	const absoluteOutputPath = path.resolve(process.cwd(), outputPath);

	if (verbose) {
		console.log(`Reading files and directories at ${absoluteNodePath}`);
	}
	const directory = await FsTree.read(absoluteNodePath);

	return directory;
}

async function filter(node: FsObject, filterPath: string, verbose: boolean = false) {
	const filterFullPath = path.resolve(process.cwd(), filterPath);

	const filtersByType = await FilterFactory.getFromFile(filterFullPath);

	if (verbose) {
		console.log(`Filtering...`);
	}
	const purges = await FilterMatcher.getPurges(node, filtersByType);
	if (verbose) {
		console.log(`Filtering completed. Found ${purges.length} item${purges.length === 1 ? 's' : ''} for purging`);
	}

	return purges;
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
		case FilterMatchPurge:
		case RecommendedPurge: {
			message += purge.getPurgeReason({ colorized });
			break;
		}

		default:
			message += `${purge.message ? purge.message : 'Error'}: ${JSON.stringify(purge)}`;
	}

	return message + '\n';
}
