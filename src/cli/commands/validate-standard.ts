import path from 'path';

import { CachingConditionFactory } from '../../standard/condition/CachingConditionFactory';
import { ConditionFactory } from '../../standard/condition/ConditionFactory';
import { RuleFactory } from '../../standard/rule/RuleFactory';
import { VideoStandardFactory } from '../../standard/video-standard/VideoStandardFactory';
import { FsFileReader } from '../../standard/FsFileReader';
import { JSON5Parser } from '../../standard/JSON5Parser';
import { SchemaParser } from '../../standard/SchemaParser';
import { StandardFactory } from '../../standard/StandardFactory';
import { IStandardReader } from '../helpers/IStandardReader';
import { StandardReader } from '../helpers/StandardReader';
import BaseCommand from '../BaseCommand';

export default class ValidateStandard extends BaseCommand {
	static description = 'Validate standard';

	static args = [
		{
			name: 'standardPath',
			required: true,
			description: 'Path to a definition of a standard in JSON or JSON5',
			parse: async (input: string) => path.resolve(process.cwd(), input)
		}
	];

	static examples = [
		'$ media-inspector validate-standard ./examples/standard-default.json5'
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
		const { args } = await this.parse(ValidateStandard);
		const standardPath = args.standardPath as string;

		try {
			await this.standardReader.read(standardPath, true);
		}
		catch (error) {
			this.error('Validation failed');
			throw error;
		}
		this.log('Standard is valid');
	}
}
