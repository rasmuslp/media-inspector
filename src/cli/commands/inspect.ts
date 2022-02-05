import path from 'path';

import { flags } from '@oclif/command';
import chalk from 'chalk';
import cli from 'cli-ux';

import { Directory, FsNode, PathSorters } from '../../fs-tree';
import { AuxiliaryMatch } from '../../matcher/AuxiliaryMatch';
import { FilterMatch } from '../../matcher/FilterMatch';
import { FilterMatcher } from '../../matcher/FilterMatcher';
import { Match } from '../../matcher/Match';
import { MetadataCache } from '../../metadata/MetadataCache';
import { ConditionFactory } from '../../standard/condition/ConditionFactory';
import { CachingConditionFactory } from '../../standard/condition/CachingConditionFactory';
import { RuleFactory } from '../../standard/rule/RuleFactory';
import { VideoStandardFactory } from '../../standard/video-standard/VideoStandardFactory';
import { VideoStandard } from '../../standard/video-standard/VideoStandard';
import { FsFileReader } from '../../standard/FsFileReader';
import { JSON5Parser } from '../../standard/JSON5Parser';
import { SchemaParser } from '../../standard/SchemaParser';
import { StandardFactory } from '../../standard/StandardFactory';
import { Standard } from '../../standard/Standard';
import { SerializableIO } from '../../serializable/SerializableIO';
import { IStandardReader } from '../helpers/IStandardReader';
import { readMetadataFromFileSystem } from '../helpers/readMetadataFromFileSystem';
import { readMetadataFromSerialized } from '../helpers/readMetadataFromSerialized';
import { StandardReader } from '../helpers/StandardReader';
import BaseCommand from '../BaseCommand';
import { verbose } from '../flags';

export default class Inspect extends BaseCommand {
	static description = 'Inspect input and hold it up to a standard';

	static flags = {
		standard: flags.string({
			char: 's',
			description: 'Path of the standard to apply in JSON or JSON5',
			parse: (input: string): string => path.resolve(process.cwd(), input),
			required: true
		}),

		includeAuxiliary: flags.boolean({
			char: 'i',
			default: false,
			description: 'Will also include empty directories and \'container\' directories'
		}),

		read: flags.string({
			char: 'r',
			description: 'Path of a directory or file, or a metadata cache file to read',
			parse: input => path.resolve(process.cwd(), input),
			required: true
		}),

		verbose
	};

	static examples = [
		'$ media-inspector inspect -r ~/Downloads -s ./examples/standard-default.json5',
		'$ media-inspector inspect -r ~/Downloads/file.ext -s ./examples/standard-default.json5',
		'$ media-inspector inspect -r downloads.json -s ./examples/standard-default.json5',
		'$ media-inspector inspect -r downloads.json -s ./examples/standard-default.json5 -i -v'
	];

	private standardReader: IStandardReader;

	async init() {
		this.standardReader = new StandardReader(
			new FsFileReader(),
			new JSON5Parser(),
			new SchemaParser(),
			new StandardFactory(new VideoStandardFactory(new RuleFactory(new CachingConditionFactory(new ConditionFactory()))))
		);
	}

	async run() {
		const { flags } = this.parse(Inspect);

		const metadataCache = await (SerializableIO.isSerializePath(flags.read) ? readMetadataFromSerialized(flags.read) : readMetadataFromFileSystem(flags.read, flags.verbose));

		const matches: Match[] = [];
		const filterMatches = await this.filter(metadataCache, flags.standard, flags.verbose);
		matches.push(...filterMatches);

		if (flags.includeAuxiliary) {
			// TODO: I need proper DFS to ensure that parent dirs will capture children that are marked for matcher
			await metadataCache.tree.traverse(async (node: FsNode) => {
				if (node instanceof Directory) {
					const children = metadataCache.tree.getDirectChildren(node);
					if (children.length === 0) {
						matches.push(new AuxiliaryMatch('Directory empty', node));
					}
					else {
						const childPaths = new Set(children.map(fsNode => fsNode.path));
						const matchedChildren = matches.filter(match => childPaths.has(match.fsNode.path));

						// Get sizes of matched children
						let sizeOfMatchedChildren = 0;
						for (const match of matchedChildren) {
							sizeOfMatchedChildren += match.fsNode.size;
						}

						const sizeOfTree = await metadataCache.tree.getSize(node);

						// Take parent and all children when this was the majority
						if (sizeOfMatchedChildren >= 0.9 * sizeOfTree) {
							// Mark tree from directory as Purgable
							const treeAsList = await metadataCache.tree.getAsSortedList(node);
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

			const size = await metadataCache.tree.getSize();
			this.log('Total Size:\t', size);

			const reduction = (spaceFreeable / size) * 100;
			this.log(`Reduction: ${reduction.toFixed(2)}%`);
		}
	}

	async filter(metadataCache: MetadataCache, filterPath: string, verbose = false): Promise<Match[]> {
		const standard: Standard = await this.standardReader.read(filterPath, verbose);
		const videoStandard = standard.videoStandard as VideoStandard; // TODO: Hacky

		if (verbose) {
			cli.action.start('Filtering...');
		}
		const matches = await FilterMatcher.getMatches(metadataCache, videoStandard.rules);
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

	return `${message}\n`;
}
