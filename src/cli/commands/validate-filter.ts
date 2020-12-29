import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import cli from 'cli-ux';

import { FilterFactory } from '../../filter';
import BaseCommand from '../BaseCommand';

const readFile = promisify(fs.readFile);

export default class ValidateFilter extends BaseCommand {
	static description = 'Validate filter'

	static args = [
		{
			name: 'filterPath',
			required: true,
			description: 'Path to filter in JSON or JSON5',
			parse: (input: string): string => path.resolve(process.cwd(), input)
		}
	]

	static examples = [
		'$ media-inspector validate-filter ./examples/filter-default.json5'
	]

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	async run() {
		const { args } = this.parse(ValidateFilter);

		const filterPath = args.filterPath as string;

		cli.action.start(`Reading filter from ${filterPath}`);
		let fileContent;
		try {
			fileContent = await readFile(args.filterPath, 'utf8');
		}
		catch (error) {
			throw new Error(`Could not read filter at '${filterPath}': ${(error as Error).message}`);
		}
		cli.action.stop();

		cli.action.start('Validating');
		try {
			FilterFactory.getFromSerialized(fileContent);
		}
		catch (error) {
			this.error('Validation failed');
			throw error;
		}
		cli.action.stop();
		this.log('Filter OK');
	}
}
