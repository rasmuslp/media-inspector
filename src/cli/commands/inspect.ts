import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { flags } from '@oclif/command';
import chalk from 'chalk';
import cli from 'cli-ux';

import { FilterFactory } from '../../filter';
import { Directory, FsNode, FsTree, PathSorters } from '../../fs-tree';
import { AuxiliaryMatch } from '../../matcher/AuxiliaryMatch';
import { FilterMatch } from '../../matcher/FilterMatch';
import { FilterMatcher } from '../../matcher/FilterMatcher';
import { Match } from '../../matcher/Match';
import { Serializable } from '../../serializable/Serializable';
import { readMetadataFromFileSystem } from '../glue/readMetadataFromFileSystem';
import { readMetadataFromSerialized } from '../glue/readMetadataFromSerialized';
import { MetadataCache } from '../glue/MetadataCache';
import BaseCommand from '../BaseCommand';

const readFile = promisify(fs.readFile);

export default class Inspect extends BaseCommand {
	static description = 'Inspect input with filter'

	static flags = {
		filter: flags.string({
			char: 'f',
			description: 'Path of the filter to apply in JSON or JSON5',
			parse: input => path.resolve(process.cwd(), input),
			required: true
		}),

		includeAuxiliary: flags.boolean({
			char: 'i',
			default: false,
			description: 'Will also include empty directories and \'container\' directories'
		}),

		read: flags.string({
			char: 'r',
			description: 'Path of a directory or cache file to read', // TODO: Must this be a directory?
			parse: input => path.resolve(process.cwd(), input),
			required: true
		}),

		verbose: flags.boolean({
			char: 'v',
			default: false,
			description: 'Enable to get progress and detailed information on matches. ' +
				'By default only matched absolute paths are logged, so the output can be piped'
		})
	}

	static examples = [
		'$ media-inspector inspect -r downloads.json -f ./examples/filter-default.json5',
		'$ media-inspector inspect -r downloads.json -f ./examples/filter-default.json5 -i -v'
	]

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	async run() {
		const { flags } = this.parse(Inspect);

		const metadataCache = await (Serializable.isSerializePath(flags.read) ? readMetadataFromSerialized(flags.read) : readMetadataFromFileSystem(flags.read, flags.verbose));

		const matches: Match[] = [];
		if (flags.filter) {
			const filterMatches = await this.filter(metadataCache, flags.filter, flags.verbose);
			matches.push(...filterMatches);
		}

		if (flags.includeAuxiliary) {
			// TODO: I need proper DFS to ensure that parent dirs will capture children that are marked for matcher
			await FsTree.traverse(metadataCache.rootNode, async (node: FsNode) => {
				if (node instanceof Directory) {
					if (!node.children || node.children.length === 0) {
						matches.push(new AuxiliaryMatch('Directory empty', node));
					}
					else {
						const childPaths = new Set(node.children.map(fsNode => fsNode.path));
						const matchedChildren = matches.filter(match => childPaths.has(match.fsNode.path));

						// Get sizes of matched children
						let sizeOfMatchedChildren = 0;
						for (const match of matchedChildren) {
							sizeOfMatchedChildren += match.fsNode.size;
						}

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
		const dedupedMap = new Map<FsNode, Match>();
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
		const dedupedPurgres = [...dedupedMap.values()].sort((a, b) => PathSorters.childrenBeforeParents(a.fsNode.path, b.fsNode.path));

		for (const match of dedupedPurgres) {
			if (flags.verbose) {
				const message = getLogMessageOfMatch(match, { colorized: true });
				this.log(message);
			}
			else {
				this.log(match.fsNode.path);
			}
		}

		if (flags.verbose) {
			let spaceFreeable = 0;
			for (const match of dedupedPurgres) {
				spaceFreeable += match.fsNode.size;
			}

			this.log('Space freeable:\t', spaceFreeable);

			const size = await FsTree.getSize(metadataCache.rootNode);
			this.log('Total Size:\t', size);

			const reduction = spaceFreeable / size * 100;
			this.log(`Reduction: ${reduction.toFixed(2)}%`);
		}
	}

	async filter(metadataCache: MetadataCache, filterPath: string, verbose = false): Promise<Match[]> {
		const absoluteFilterPath = path.resolve(process.cwd(), filterPath);

		if (verbose) {
			cli.action.start(`Reading filter rules from ${absoluteFilterPath}`);
		}
		let fileContent;
		try {
			fileContent = await readFile(absoluteFilterPath, 'utf8');
		}
		catch (error) {
			throw new Error(`Could not read filter at '${absoluteFilterPath}': ${(error as Error).message}`);
		}
		if (verbose) {
			cli.action.stop();
		}

		const filterRules = FilterFactory.getFromSerialized(fileContent);

		if (verbose) {
			cli.action.start('Filtering...');
		}
		const matches = await FilterMatcher.getMatches(metadataCache, filterRules);
		if (verbose) {
			cli.action.stop();
			this.log(`Found ${matches.length} item${matches.length === 1 ? 's' : ''} for purging`);
		}

		return matches;
	}
}

function getLogMessageOfMatch(match: Match, { colorized = false } = {}): string {
	let message = `${colorized ? chalk.yellow(match.fsNode.path) : match.fsNode.path}\n\t`;
	message += match.fsNode instanceof Directory ? '[Directory]' : '[File]';
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
