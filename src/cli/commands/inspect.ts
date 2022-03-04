import path from 'path';

import { CliUx, Flags } from '@oclif/core';
import chalk from 'chalk';

import { ConditionsAnalyzer } from '../../analyzer/condition/ConditionsAnalyzer';
import { ConditionAnalyzer } from '../../analyzer/condition/ConditionAnalyzer';
import { IFileAnalysisResult } from '../../analyzer/interfaces/IFileAnalysisResult';
import { FileAnalyzer } from '../../analyzer/FileAnalyzer';
import { VideoFileAnalysisResult } from '../../analyzer/VideoFileAnalysisResult';
import { VideoFileAnalyzer } from '../../analyzer/VideoFileAnalyzer';
import { VideoFileRuleConditionsAnalyzer } from '../../analyzer/VideoFileRuleConditionsAnalyzer';
import { VideoFileRuleMatcher } from '../../analyzer/VideoFileRuleMatcher';
import {
	Directory, File, FsNode, FsTree, PathSorters
} from '../../fs-tree';
import { MetadataCache } from '../../metadata/MetadataCache';
import { ConditionFactory } from '../../standard/condition/ConditionFactory';
import { CachingConditionFactory } from '../../standard/condition/CachingConditionFactory';
import { VideoRuleFactory } from '../../standard/video-standard/VideoRuleFactory';
import { VideoStandardFactory } from '../../standard/video-standard/VideoStandardFactory';
import { FsFileReader } from '../../standard/FsFileReader';
import { JSON5Parser } from '../../standard/JSON5Parser';
import { SchemaParser } from '../../standard/SchemaParser';
import { StandardFactory } from '../../standard/StandardFactory';
import { Standard } from '../../standard/Standard';
import { SerializableIO } from '../../serializable/SerializableIO';
import { VideoErrorDetectorFactory } from '../../video-error-detector/VideoErrorDetectorFactory';
import { PrintableOptions } from '../helpers/printable/PrintableOptions';
import { PrintableAuxiliaryResult } from '../helpers/printable/PrintableAuxiliaryResult';
import { PrintableVideoResult } from '../helpers/printable/PrintableVideoResult';
import { IPrintable } from '../helpers/printable/IPrintable';
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

		satisfied: Flags.boolean({
			allowNo: true,
			default: false,
			description: 'Print files that are satisfied by the standard. Can be reversed by prefixing no-'
		}),

		includeEmpty: Flags.boolean({
			char: 'e',
			default: false,
			description: 'Also print empty directories',
			exclusive: ['satisfied']
		}),

		includeAuxiliary: Flags.boolean({
			char: 'a',
			default: false,
			description: 'Will also include empty directories and \'container\' directories',
			exclusive: ['satisfied']
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
		const analysisResults = await this.analyze(metadataCache, flags.standard, flags.verbose);
		const printableResults = await this.getPrintableResults(metadataCache.tree, analysisResults, flags.satisfied, flags.includeEmpty, flags.includeAuxiliary);
		const logMessages = this.getLogMessages(printableResults, flags.verbose);

		if (flags.verbose) {
			logMessages.push(...(await this.getSummary(metadataCache.tree, printableResults)));
		}

		for (const message of logMessages) {
			this.log(message);
		}
	}

	async analyze(metadataCache: MetadataCache, standardPath: string, verbose = false): Promise<Map<FsNode, IFileAnalysisResult>> {
		const conditionsAnalyzer = new ConditionsAnalyzer(new ConditionAnalyzer());
		const videoFileRuleMatcher = new VideoFileRuleMatcher(metadataCache, conditionsAnalyzer);
		const videoFileRuleConditionsAnalyzer = new VideoFileRuleConditionsAnalyzer(conditionsAnalyzer, metadataCache, new VideoErrorDetectorFactory());
		const videoFileAnalyzer = new VideoFileAnalyzer(videoFileRuleMatcher, videoFileRuleConditionsAnalyzer);
		const standard: Standard = await this.standardReader.read(standardPath, verbose);
		const fileAnalyzer = new FileAnalyzer(videoFileAnalyzer, standard);

		if (verbose) {
			CliUx.ux.action.start('Analyzing...');
		}

		const analysisResults = new Map<FsNode, IFileAnalysisResult>();
		await metadataCache.tree.traverse(async (node: FsNode) => {
			if (node.name.startsWith('.')) {
				// Skip hidden files. Don't know what these are, but macOS can sure generate some strange looking files, that produce some strange looking MediainfoMetadata.
				return;
			}

			if (node instanceof File) {
				const fileAnalysisResult = fileAnalyzer.analyze(node);
				if (fileAnalysisResult) {
					analysisResults.set(node, fileAnalysisResult);
				}
			}
		});

		if (verbose) {
			CliUx.ux.action.stop();
			this.log(`Processed ${analysisResults.size} file${analysisResults.size === 1 ? 's' : ''}`);
		}

		return analysisResults;
	}

	async getPrintableResults(tree: FsTree, analysisResults: Map<FsNode, IFileAnalysisResult>, satisfied: boolean, includeEmpty: boolean, includeAuxiliary: boolean): Promise<Map<FsNode, IPrintable>> {
		const printableResults = new Map<FsNode, IPrintable>();

		// Process analysis results
		for (const [file, fileAnalysisResult] of analysisResults.entries()) {
			const seekingSatisfiedAndFileSatisfied = satisfied && fileAnalysisResult.isSatisfied;
			const seekingNonSatisfiedAndFileNotSatisfied = !satisfied && !fileAnalysisResult.isSatisfied;

			if (seekingSatisfiedAndFileSatisfied || seekingNonSatisfiedAndFileNotSatisfied) {
				if (fileAnalysisResult instanceof VideoFileAnalysisResult) {
					printableResults.set(file, new PrintableVideoResult(fileAnalysisResult));
				}
				else {
					throw new TypeError('fileAnalysisResult must be instance of VideoFileAnalysisResult');
				}
			}
		}

		// Process tree with extra flags
		if (!satisfied) {
			if (includeEmpty) {
				await tree.traverse(async (node: FsNode) => {
					if (node instanceof Directory) {
						const children = tree.getDirectChildren(node);
						if (children.length === 0) {
							printableResults.set(node, new PrintableAuxiliaryResult('Directory empty'));
						}
					}
				});
			}

			if (includeAuxiliary) {
				// TODO: I need proper DFS to ensure that parent dirs will capture children that are marked for matcher
				await tree.traverse(async (node: FsNode) => {
					if (node instanceof Directory) {
						const children = tree.getDirectChildren(node);
						if (children.length > 0) {
							const matchedChildren = children.filter(i => printableResults.has(i));

							// Get sizes of matched children
							let sizeOfMatchedChildren = 0;
							for (const child of matchedChildren) {
								// I don't think this will capture the true size of the matched sub-tree. Size of Directories are 0, and I get only direct children.
								sizeOfMatchedChildren += child.size;
							}

							const sizeOfTree = await tree.getSize(node);

							if (sizeOfMatchedChildren >= 0.9 * sizeOfTree) {
								// Match whole sub-tree
								const subTreeAsList = await tree.getAsList(node);
								const newAuxiliaryMatches = subTreeAsList.filter(i => !printableResults.has(i));
								for (const match of newAuxiliaryMatches) {
									printableResults.set(match, new PrintableAuxiliaryResult(`Auxiliary to ${node.path}`));
								}
							}
						}
					}
				});
			}
		}

		return printableResults;
	}

	getLogMessages(printableResults: Map<FsNode, IPrintable>, verbose: boolean): string[] {
		const messages: string[] = [];

		// Get FsNodes and sort by path
		const nodesSortedByPath = [...printableResults.keys()].sort((a, b) => PathSorters.childrenBeforeParents(a.path, b.path));
		for (const node of nodesSortedByPath) {
			if (verbose) {
				const printableResult = printableResults.get(node);

				const message = getLogMessageOfNodeAndResult(node, printableResult, { colorized: true });
				messages.push(message);
			}
			else {
				messages.push(node.path);
			}
		}

		return messages;
	}

	async getSummary(tree: FsTree, printableResults: Map<FsNode, IPrintable>): Promise<string[]> {
		const messages: string[] = [];

		let matchedSize = 0;
		for (const match of printableResults.keys()) {
			matchedSize += match.size;
		}
		const totalSize = await tree.getSize();
		const percentage = (matchedSize / totalSize) * 100;

		messages.push(`${percentage.toFixed(2)}%`);
		// eslint-disable-next-line unicorn/no-array-push-push
		messages.push(`Matched size:\t ${matchedSize}`);
		// eslint-disable-next-line unicorn/no-array-push-push
		messages.push(`Total size:\t ${totalSize}`);

		return messages;
	}
}

function getLogMessageOfNodeAndResult(node: FsNode, printable: IPrintable, options: PrintableOptions): string {
	let message = `${options.colorized ? chalk.yellow(node.path) : node.path}\n`;
	message += node instanceof Directory ? '[Directory]' : '[File]';
	message += ' ';

	if (!printable) {
		message += `${options.colorized ? chalk.red('ERROR') : 'ERROR'} No printable result provided`;
	}
	else {
		const subMessages = printable.getStrings(options);
		// Slice of first string, and add to current line, then just newline the rest for now
		if (subMessages.length > 0) {
			message += subMessages[0];
		}
		if (subMessages.length > 1) {
			for (let i = 1; i < subMessages.length; i++) {
				message += `\n${subMessages[i]}`;
			}
		}
	}

	return `${message}\n`;
}
