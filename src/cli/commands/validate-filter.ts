import path from 'path';

import cli from 'cli-ux';

import BaseCommand from '../BaseCommand';
import { readFilterFromSerialized } from '../helpers/readFilterFromSerialized';

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

		cli.action.start(`Validating rules from ${filterPath}`);
		try {
			await readFilterFromSerialized(filterPath, false);
		}
		catch (error) {
			this.error('Validation failed');
			throw error;
		}
		cli.action.stop();
		this.log('Filter OK');
	}
}
