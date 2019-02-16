/* eslint-disable @typescript-eslint/no-use-before-define */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import chalk from 'chalk';

import { FilterFactory } from './filter';
import { FsTree, Directory, MediaFile, FsNode } from './fs-tree';

import { FilterMatch } from './matcher/FilterMatch';
import { AuxiliaryMatch } from './matcher/AuxiliaryMatch';

import { FilterMatcher } from './matcher/FilterMatcher';
import { Match } from './matcher/Match';

const readFile = promisify(fs.readFile);

export interface LibOptions {
	readPath: string;
	writePath?: string;
	filterPath?: string;
	includeAuxiliary?: boolean;
	verbose?: boolean;
}

export async function run(options: LibOptions): Promise<void> {
	if (FsTree.isSerializePath(options.readPath) && options.writePath) {
		throw new Error(`Why would you read json just to write it again?! (」ﾟﾛﾟ)｣`);
	}

	const absoluteReadPath = path.resolve(process.cwd(), options.readPath);

	let node;
	if (FsTree.isSerializePath(options.readPath)) {
		if (options.verbose) {
			console.log(`Reading from json ${absoluteReadPath}`);
		}
		node = await FsTree.getFromSerialized(absoluteReadPath);
	}
	else {
		if (options.verbose) {
			console.log(`Reading from file system ${absoluteReadPath}`);
		}
		node = await FsTree.getFromFileSystem(absoluteReadPath);
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

	const matches = [];

	if (options.filterPath) {
		const filterMatches = await filter(node, options.filterPath, options.verbose);
		matches.push(...filterMatches);
	}

	if (options.includeAuxiliary) {
		// TODO: I need proper DFS to ensure that parent dirs will capture children that are marked for matcher
		await FsTree.traverse(node, async node => {
			if (node.isDirectory()) {
				if (!node.children || node.children.length === 0) {
					matches.push(new AuxiliaryMatch(`Directory empty`, node));
				}
				else {
					const childPaths = node.children.map(fsNode => fsNode.path);
					const matchedChildren = matches.filter(match => childPaths.includes(match.fsNode.path));

					// Get sizes of matched children
					const sizeOfMatchedChildren = matchedChildren
						.map(match => match.fsNode.size)
						.reduce((acc, cur) => (acc += cur), 0);

					const sizeOfTree = await FsTree.getSize(node);

					// Take parent and all children when this was the majority
					if (sizeOfMatchedChildren >= 0.9 * sizeOfTree) {
						// Mark tree from directory as Purgable
						const treeAsList = await FsTree.getAsSortedList(node);
						const auxiliaryMatches = treeAsList.map(childNode => new AuxiliaryMatch(`Auxiliary to ${node.path}`, childNode));

						matches.push(...auxiliaryMatches);
					}
				}
			}
		});
	}

	// Dedupe list
	const dedupedMap = new Map();
	for (const match of matches) {
		const existing = dedupedMap.get(match.fsNode);
		if (existing) {
			// Update if current has better score
			if (existing.score < match.score) {
				dedupedMap.set(match.fsNode, match);
			}
		}
		else {
			// Store as unique otherwise
			dedupedMap.set(match.fsNode, match);
		}
	}

	// Sort deduped
	const dedupedPurgres = Array.from(dedupedMap.values()).sort((a, b) => Directory.getSortFnByPathDirFile(a.fsNode, b.fsNode));

	for (const match of dedupedPurgres) {
		if (options.verbose) {
			const message = getLogMessageOfMatch(match, { colorized: true });
			console.log(message);
		}
		else {
			console.log(match.fsNode.path);
		}
	}

	if (options.verbose) {
		const spaceFreeable = dedupedPurgres
			.map(match => match.fsNode.size)
			.reduce((acc, cur) => (acc += cur), 0);

		console.log('Space freeable: ', spaceFreeable);

		const size = await FsTree.getSize(node);
		console.log('Total Size: ', size);

		const reduction = spaceFreeable / size * 100;
		console.log(`Reduction: ${reduction.toFixed(2)}%`);
	}
}

async function filter(node: FsNode, filterPath: string, verbose: boolean = false): Promise<Match[]> {
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
	const matches = await FilterMatcher.getMatches(node, filterRules);
	if (verbose) {
		console.log(`Filtering completed. Found ${matches.length} item${matches.length === 1 ? 's' : ''} for purging`);
	}

	return matches;
}

function getLogMessageOfMatch(match, { colorized = false } = {}): string {
	let message = `${colorized ? chalk.yellow(match.fsNode.path) : match.fsNode.path}\n\t`;

	if (match.fsNode.isDirectory()) {
		message += `[Directory]`;
	}
	else if (match.fsNode instanceof MediaFile) {
		message += `[Media file]`;
	}
	else {
		message += `[File]`;
	}

	message += ' ';

	switch (match.constructor) {
		case FilterMatch:
		case AuxiliaryMatch: {
			message += match.getMatchReason({ colorized });
			break;
		}

		default:
			message += `${match.message ? match.message : 'Error'}: ${JSON.stringify(match)}`;
	}

	return message + '\n';
}
