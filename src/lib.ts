import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import zlib from 'zlib';

import chalk from 'chalk';

import { FilterFactory } from './filter';
import {FsTree, Directory, MediaFile, FsObject} from './fs-tree';

import { FilterMatchPurge } from './purge/FilterMatchPurge';
import { RecommendedPurge } from './purge/RecommendedPurge';

import { FilterMatcher } from './FilterMatcher';

const writeFile = promisify(fs.writeFile);
const gzip = promisify(zlib.gzip);

export interface libOptions {
	readPath: string,
	writePath?: string,
	filterPath?: string,
	includeRecommended?: boolean,
	verbose?: boolean
}

export async function run(options: libOptions) {
	const node = await readPath(options.readPath, options.verbose);

	if (options.writePath) {
		const serialized = node.serialize();
		let data = JSON.stringify(serialized, null, 4);
		let zipped;
		if (options.writePath.endsWith('.gz')) {
			zipped = await gzip(data);
		}
		await writeFile(options.writePath, zipped || data);

		return;
	}

	const purges = [];

	if (options.filterPath) {
		const filterMatchPurges = await filter(node, options.filterPath, options.verbose);
		purges.push(...filterMatchPurges);
	}

	if (options.includeRecommended) {
		// TODO: I need proper DFS to ensure that parent dirs will capture children that are marked for purge
		await FsTree.traverse(node, async node => {
			if (node.isDirectory()) {
				if (!node.children || node.children.length === 0) {
					purges.push(new RecommendedPurge(`Directory empty`, node));
				}
				else {
					const childPaths = node.children.map(fsObject => fsObject.path);
					const purgedChildren = purges.filter(purge => childPaths.includes(purge.fsObject.path));

					// Get sizes of purged children
					const sizesOfPurgedChildrenPromises = purgedChildren.map(purge => FsTree.getSize(purge.fsObject));
					const sizesOfPurgedChildren = await Promise.all(sizesOfPurgedChildrenPromises);
					const totalSizeOfPurgedChildren = purgedChildren
						.map(purge => purge.fsObject.size)
						.reduce((acc, cur) => (acc += cur), 0);

					const sizeOfTree = await FsTree.getSize(node);

					// Take parent and all children when this was the majority
					if (totalSizeOfPurgedChildren >= 0.9 * sizeOfTree) {
						// Mark tree from directory as Purgable
						const treeAsList = await FsTree.getAsSortedList(node);
						const recommendedPurges = treeAsList.map(childNode => new RecommendedPurge(`Auxiliary file or folder to ${node.path}`, childNode));

						purges.push(...recommendedPurges);
					}
				}
			}
		});
	}

	// Dedupe list
	const dedupedMap = new Map();
	for (const purge of purges) {
		const existing = dedupedMap.get(purge.fsObject);
		if (existing) {
			// Update if current has better score
			if (existing.score < purge.score) {
				dedupedMap.set(purge.fsObject, purge);
			}
		}
		else {
			// Store as unique otherwise
			dedupedMap.set(purge.fsObject, purge);
		}
	}

	// Sort deduped
	const dedupedPurgres = Array.from(dedupedMap.values()).sort((a, b) => Directory.getSortFnByPathDirFile(a.fsObject, b.fsObject));

	for (const purge of dedupedPurgres) {
		if (options.verbose) {
			const message = getLogMessageOfPurge(purge, { colorized: true });
			console.log(message);
		}
		else {
			console.log(purge.fsObject.path);
		}
	}

	if (options.verbose) {
		const spaceFreeable = dedupedPurgres
			.map(purge => purge.fsObject.size)
			.reduce((acc, cur) => (acc += cur), 0);

		console.log('Space freeable: ', spaceFreeable);

		const size = await FsTree.getSize(node);
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
	const node = await FsTree.read(absoluteNodePath);

	return node;
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

	if (purge.fsObject.isDirectory()) {
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
