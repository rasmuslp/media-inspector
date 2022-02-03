import path from 'path';

import cli from 'cli-ux';

import BaseCommand from '../BaseCommand';
import { FsFileReader } from '../../standard/FsFileReader';
import { JSON5Parser } from '../../standard/JSON5Parser';
import { SchemaParser } from '../../standard/SchemaParser';
import { StandardReader } from '../helpers/StandardReader';

export default class ValidateStandard extends BaseCommand {
	static description = 'Validate standard';

	static args = [
		{
			name: 'standardPath',
			required: true,
			description: 'Path to a definition of a standard in JSON or JSON5',
			parse: (input: string): string => path.resolve(process.cwd(), input)
		}
	];

	static examples = [
		'$ media-inspector validate-standard ./examples/standard-default.json5'
	];

	async run() {
		const { args } = this.parse(ValidateStandard);

		const standardPath = args.standardPath as string;

		const standardReader = new StandardReader(
			new FsFileReader(),
			new JSON5Parser(),
			new SchemaParser()
		);

		cli.action.start(`Validating standard from file ${standardPath}`);
		try {
			await standardReader.read(standardPath, false);
		}
		catch (error) {
			this.error('Validation failed');
			throw error;
		}
		cli.action.stop();
		this.log('Standard is valid');
	}
}
