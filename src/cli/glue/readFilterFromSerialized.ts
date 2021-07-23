import cli from 'cli-ux';

import { FilterFactory } from '../../filter';
import { Rule } from '../../filter/rule/Rule';

export async function readFilterFromSerialized(path: string, verbose = false): Promise<Rule[]> {
	if (verbose) {
		cli.action.start(`Reading filter rules from ${path}`);
	}
	const fileContent = await FilterFactory.read(path);

	if (verbose) {
		cli.action.stop();
	}

	if (verbose) {
		cli.action.start(`Parsing ${path}`);
	}

	const serialized = await FilterFactory.parse(fileContent);
	const filter = FilterFactory.getFromSerialized(serialized);

	if (verbose) {
		cli.action.stop();
	}

	return filter;
}
