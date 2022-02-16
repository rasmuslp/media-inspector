import path from 'path';

import { CliUx, Flags } from '@oclif/core';
import chalk from 'chalk';

import { ConditionsAnalyzer } from '../../analyzer/condition/ConditionsAnalyzer';
import { ConditionAnalyzer } from '../../analyzer/condition/ConditionAnalyzer';
import { TypeNotSupportedResult } from '../../analyzer/result/TypeNotSupportedResult';
import { VideoFileAnalysisResult } from '../../analyzer/result/VideoFileAnalysisResult';
import { FileStandardAnalyzer } from '../../analyzer/FileStandardAnalyzer';
import { IFileAnalysisResult } from '../../analyzer/IFileAnalysisResult';
import { StandardSatisfied } from '../../analyzer/StandardSatisfied';
import { VideoRuleResult } from '../../analyzer/VideoRuleResult';
import { VideoFileRuleConditionsAnalyzer } from '../../analyzer/VideoFileRuleConditionsAnalyzer';
import { VideoFileRuleMatcher } from '../../analyzer/VideoFileRuleMatcher';
import {
	Directory, File, FsNode, PathSorters
} from '../../fs-tree';
import { AuxiliaryMatch } from '../../matcher/AuxiliaryMatch';
import { FilterMatch } from '../../matcher/FilterMatch';
import { Match } from '../../matcher/Match';
import { MetadataCache } from '../../metadata/MetadataCache';
import { ConditionFactory } from '../../standard/condition/ConditionFactory';
import { CachingConditionFactory } from '../../standard/condition/CachingConditionFactory';
import { RuleResult } from '../../standard/video-standard/RuleResult';
import { VideoRuleFactory } from '../../standard/video-standard/VideoRuleFactory';
import { VideoStandardFactory } from '../../standard/video-standard/VideoStandardFactory';
import { FsFileReader } from '../../standard/FsFileReader';
import { JSON5Parser } from '../../standard/JSON5Parser';
import { SchemaParser } from '../../standard/SchemaParser';
import { StandardFactory } from '../../standard/StandardFactory';
import { Standard } from '../../standard/Standard';
import { SerializableIO } from '../../serializable/SerializableIO';
import { VideoErrorDetectorFactory } from '../../video-error-detector/VideoErrorDetectorFactory';
import { IStandardReader } from '../helpers/IStandardReader';
import { readMetadataFromFileSystem } from '../helpers/readMetadataFromFileSystem';
import { readMetadataFromSerialized } from '../helpers/readMetadataFromSerialized';
import { StandardReader } from '../helpers/StandardReader';
import BaseCommand from '../BaseCommand';
import { verbose } from '../flags';

export default class Inspect extends BaseCommand {
	static description = 'Inspect input and hold it up to a standard';

	static flags = {
		standard: Flags.string({
			char: 's',
			description: 'Path of the standard to apply in JSON or JSON5',
			parse: async (input: string) => path.resolve(process.cwd(), input),
			required: true
		}),

		includeAuxiliary: Flags.boolean({
			char: 'i',
			default: false,
			description: 'Will also include empty directories and \'container\' directories'
		}),

		read: Flags.string({
			char: 'r',
			description: 'Path of a directory or file, or a metadata cache file to read',
			parse: async input => path.resolve(process.cwd(), input),
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
			new StandardFactory(new VideoStandardFactory(new VideoRuleFactory(new CachingConditionFactory(new ConditionFactory()))))
		);
	}

	async run() {
		const { flags } = await this.parse(Inspect);

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
		const conditionsAnalyzer = new ConditionsAnalyzer(new ConditionAnalyzer());
		const videoFileRuleMatcher = new VideoFileRuleMatcher(metadataCache, conditionsAnalyzer);
		const videoFileRuleAnalyzer = new VideoFileRuleConditionsAnalyzer(conditionsAnalyzer, metadataCache, new VideoErrorDetectorFactory());
		const standard: Standard = await this.standardReader.read(filterPath, verbose);
		const fileStandardAnalyzer = new FileStandardAnalyzer(standard, videoFileRuleMatcher, videoFileRuleAnalyzer);

		if (verbose) {
			CliUx.ux.action.start('Filtering...');
		}

		const analysisResults = new Map<File, IFileAnalysisResult>();
		await metadataCache.tree.traverse(async (node: FsNode) => {
			if (node.name.startsWith('.')) {
				// Skip hidden files. Don't know what these are, but macOS can sure generate some strange looking files, that produce some strange looking MediainfoMetadata.
				return;
			}
			if (node instanceof File) {
				const fileAnalysisResult = fileStandardAnalyzer.analyze(node);
				// NB: Skipping TypeNotSupportedResult, as this can be A LOT when scanning a directory that is not purely video data. This is very noisy and useless for now.
				if (fileAnalysisResult instanceof TypeNotSupportedResult) {
					// At this level, we only care about file types that we can define standards for.
					return;
				}

				analysisResults.set(node, fileAnalysisResult);
			}
		});

		const matches: Match[] = [];
		for (const [file, fileAnalysisResult] of analysisResults.entries()) {
			if (fileAnalysisResult.standardSatisfied() === StandardSatisfied.YES) {
				continue;
			}

			const videoRuleResults = (fileAnalysisResult as unknown as VideoFileAnalysisResult).getVideoRuleResults();
			const ruleResults = videoRuleResults.map(videoRuleResult => {
				const conditionResults = (videoRuleResult as unknown as VideoRuleResult).getConditionResults();
				/*
				  ConditionsAnalyzer Could not read video.framerate from video.framerate Track type 'video' not found +0ms
				  ConditionsAnalyzer Could not read video.scantype from video.scantype Track type 'video' not found +0ms
				  ConditionsAnalyzer Could not read video.format from video.format Track type 'video' not found +0ms
				  ConditionsAnalyzer Could not read video.width from video.width Track type 'video' not found +0ms
				  ConditionsAnalyzer Could not read video.format from video.format Track type 'video' not found +0ms
				  ConditionsAnalyzer Could not read video.width from video.width Track type 'video' not found +0ms
				  ConditionsAnalyzer Could not read video.format from video.format Track type 'video' not found +0ms
				  ConditionsAnalyzer Could not read video.width from video.width Track type 'video' not found +0ms
				 */
				// TODO: When track can't be found, there is no condition result
				if (conditionResults.length === 0) {
					// eslint-disable-next-line unicorn/no-useless-undefined
					return undefined;
				}
				return new RuleResult(conditionResults);
			});
			const ruleResultsFiltered = ruleResults.filter(i => i);
			if (ruleResultsFiltered.length === 0) {
				continue;
			}
			const match = new FilterMatch('Filters matched with::', file, ruleResultsFiltered);
			matches.push(match);
		}

		if (verbose) {
			CliUx.ux.action.stop();
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
