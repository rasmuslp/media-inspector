import { Rule } from '../../standard/rule/Rule';
import { StandardReader } from './StandardReader';
import { FsFileReader } from '../../standard/FsFileReader';
import { JSON5Parser } from '../../standard/JSON5Parser';
import { SchemaParser } from '../../standard/SchemaParser';

// TODO: Temporary translation layer
export async function readFilterFromSerialized(path: string, verbose = false): Promise<Rule[]> {
	const standardReader = new StandardReader(
		new FsFileReader(),
		new JSON5Parser(),
		new SchemaParser()
	);

	const standard = await standardReader.read(path, verbose);

	// NB: This is broken!
	return standard as Rule[];
}
