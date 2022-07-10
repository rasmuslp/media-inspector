import path from 'path';

import { Flags } from '@oclif/core';

import { ConditionsAnalyzer } from '../../analyzer/condition/ConditionsAnalyzer';
import { ConditionAnalyzer } from '../../analyzer/condition/ConditionAnalyzer';
import { FileAnalyzer } from '../../analyzer/FileAnalyzer';
import { VideoFileAnalyzer } from '../../analyzer/VideoFileAnalyzer';
import { VideoFileRuleConditionsAnalyzer } from '../../analyzer/VideoFileRuleConditionsAnalyzer';
import { VideoFileRuleMatcher } from '../../analyzer/VideoFileRuleMatcher';
import {
	FsNode, FsTree
} from '../../fs-tree';
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
import { FsNodePrintableTransformer } from '../helpers/printable/FsNodePrintableTransformer';
import { FsTreePrintableTransformer } from '../helpers/printable/FsTreePrintableTransformer';
import { IFsTreePrintableTransformer } from '../helpers/printable/IFsTreePrintableTransformer';
import { IPrintable } from '../helpers/printable/IPrintable';
import { IFsTreeStandardAnalyzer } from '../helpers/IFsTreeStandardAnalyzer';
import { IStandardReader } from '../helpers/IStandardReader';
import { readMetadataFromFileSystem } from '../helpers/readMetadataFromFileSystem';
import { readMetadataFromSerialized } from '../helpers/readMetadataFromSerialized';
import { FsTreeExtrasAnalyzer } from '../helpers/FsTreeExtrasAnalyzer';
import { FsTreeStandardAnalyzer } from '../helpers/FsTreeStandardAnalyzer';
import { StandardReader } from '../helpers/StandardReader';
import BaseCommand from '../BaseCommand';
import { verbose } from '../flags';
import { RatioFlag } from '../RatioFlag';

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

		includeAuxiliary: RatioFlag({
			char: 'a',
			default: 0,
			description: 'Also print \'container\' directories; i.e. directories that are larger than provided RATIO not satisfied. NB: Marks whole directory!',
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
		'$ media-inspector inspect -r downloads.json -s ./examples/standard-default.json5 -a -e -v',
		'$ media-inspector inspect -r downloads.json -s ./examples/standard-default.json5 --satisfied -v'
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
		const standard: Standard = await this.standardReader.read(flags.standard, flags.verbose);

		const conditionsAnalyzer = new ConditionsAnalyzer(new ConditionAnalyzer());
		const videoFileRuleMatcher = new VideoFileRuleMatcher(metadataCache, conditionsAnalyzer);
		const videoFileRuleConditionsAnalyzer = new VideoFileRuleConditionsAnalyzer(conditionsAnalyzer, metadataCache, new VideoErrorDetectorFactory());
		const videoFileAnalyzer = new VideoFileAnalyzer(videoFileRuleMatcher, videoFileRuleConditionsAnalyzer);
		const fileAnalyzer = new FileAnalyzer(videoFileAnalyzer, standard);
		const standardFsTreeAnalyzer: IFsTreeStandardAnalyzer = new FsTreeStandardAnalyzer(fileAnalyzer);
		const analysisResults = await standardFsTreeAnalyzer.analyze(metadataCache.tree, flags.verbose);

		const fsTreeExtrasAnalyzer = new FsTreeExtrasAnalyzer();
		const printableResults = await fsTreeExtrasAnalyzer.analyze(metadataCache.tree, analysisResults, flags.satisfied, flags.includeEmpty, flags.includeAuxiliary);

		const fsTreePrintableTransformer: IFsTreePrintableTransformer = new FsTreePrintableTransformer(new FsNodePrintableTransformer());
		const logMessages = fsTreePrintableTransformer.getMessages(printableResults, flags.verbose);

		if (flags.verbose) {
			logMessages.push(...(await this.getSummary(metadataCache.tree, printableResults)));
		}

		for (const message of logMessages) {
			this.log(message);
		}
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
