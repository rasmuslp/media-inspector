/* eslint-disable @typescript-eslint/no-use-before-define */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import chalk from 'chalk';

import { FilterFactory } from './filter';
import { FsTree, Directory, MediaFile, FsNode } from './fs-tree';

import { FilterMatchPurge } from './purge/FilterMatchPurge';
import { RecommendedPurge } from './purge/RecommendedPurge';

import { FilterMatcher } from './FilterMatcher';

const readFile = promisify(fs.readFile);

export interface LibOptions {
	readPath: string;
	writePath?: string;
	filterPath?: string;
	includeRecommended?: boolean;
	verbose?: boolean;
}

export async function run(options: LibOptions) {
	if (FsTree.isSerializePath(options.readPath) && options.writePath) {
		throw new Error(`Why would you read json just to write it again?! (」ﾟﾛﾟ)｣`);
	}

	const absoluteReadPath = path.resolve(process.cwd(), options.readPath);

	let node;
	if (FsTree.isSerializePath(options.readPath)) {
		if (options.verbose) {
			console.log(`Reading from json ${absoluteReadPath}`);
		}
		node = await FsTree.readFromSerialized(absoluteReadPath);
	}
	else {
		if (options.verbose) {
			console.log(`Reading from file system ${absoluteReadPath}`);
		}
		node = await FsTree.readFromFileSystem(absoluteReadPath);
	}

	if (options.writePath) {
		if (!FsTree.isSerializePath(options.writePath)) {
			throw new Error(`Write path should end with .json`);
		}
		const absoluteWritePath = path.resolve(process.cwd(), options.writePath);
		if (options.verbose) {
			console.log(`Writing ${absoluteWritePath}`);
		}
		await FsTree.write(node, absoluteWritePath);

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
					const childPaths = node.children.map(fsNode => fsNode.path);
					const purgedChildren = purges.filter(purge => childPaths.includes(purge.fsNode.path));

					// Get sizes of purged children
					const sizeOfPurgedChildren = purgedChildren
						.map(purge => purge.fsNode.size)
						.reduce((acc, cur) => (acc += cur), 0);

					const sizeOfTree = await FsTree.getSize(node);

					// Take parent and all children when this was the majority
					if (sizeOfPurgedChildren >= 0.9 * sizeOfTree) {
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
		const existing = dedupedMap.get(purge.fsNode);
		if (existing) {
			// Update if current has better score
			if (existing.score < purge.score) {
				dedupedMap.set(purge.fsNode, purge);
			}
		}
		else {
			// Store as unique otherwise
			dedupedMap.set(purge.fsNode, purge);
		}
	}

	// Sort deduped
	const dedupedPurgres = Array.from(dedupedMap.values()).sort((a, b) => Directory.getSortFnByPathDirFile(a.fsNode, b.fsNode));

	for (const purge of dedupedPurgres) {
		if (options.verbose) {
			const message = getLogMessageOfPurge(purge, { colorized: true });
			console.log(message);
		}
		else {
			console.log(purge.fsNode.path);
		}
	}

	if (options.verbose) {
		const spaceFreeable = dedupedPurgres
			.map(purge => purge.fsNode.size)
			.reduce((acc, cur) => (acc += cur), 0);

		console.log('Space freeable: ', spaceFreeable);

		const size = await FsTree.getSize(node);
		console.log('Total Size: ', size);

		const reduction = spaceFreeable / size * 100;
		console.log(`Reduction: ${reduction.toFixed(2)}%`);
	}
}

async function filter(node: FsNode, filterPath: string, verbose: boolean = false) {
	const absoluteFilterPath = path.resolve(process.cwd(), filterPath);

	if (verbose) {
		console.log(`Reading rules from json at ${absoluteFilterPath}`);
	}
	let fileContent;
	try {
		fileContent = await readFile(absoluteFilterPath, 'utf8');
	}
	catch (e) {
		throw new Error(`Could not read filter at '${absoluteFilterPath}': ${e.message}`);
	}
	const filterRules = FilterFactory.getFromSerialized(fileContent);

	if (verbose) {
		console.log(`Filtering...`);
	}
	const purges = await FilterMatcher.getPurges(node, filterRules);
	if (verbose) {
		console.log(`Filtering completed. Found ${purges.length} item${purges.length === 1 ? 's' : ''} for purging`);
	}

	return purges;
}

function getLogMessageOfPurge(purge, { colorized = false } = {}) {
	let message = `${colorized ? chalk.yellow(purge.fsNode.path) : purge.fsNode.path}\n\t`;

	if (purge.fsNode.isDirectory()) {
		message += `[Directory]`;
	}
	else if (purge.fsNode instanceof MediaFile) {
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
