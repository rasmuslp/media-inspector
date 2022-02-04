import { CachingConditionFactory } from '../../standard/condition/CachingConditionFactory';
import { ConditionFactory } from '../../standard/condition/ConditionFactory';
import { Rule } from '../../standard/rule/Rule';
import { RuleFactory } from '../../standard/rule/RuleFactory';
import { VideoStandardFactory } from '../../standard/video-standard/VideoStandardFactory';
import { FsFileReader } from '../../standard/FsFileReader';
import { JSON5Parser } from '../../standard/JSON5Parser';
import { SchemaParser } from '../../standard/SchemaParser';
import { StandardFactory } from '../../standard/StandardFactory';
import { StandardReader } from './StandardReader';

// TODO: Temporary translation layer
export async function readFilterFromSerialized(path: string, verbose = false): Promise<Rule[]> {
	const standardReader = new StandardReader(
		new FsFileReader(),
		new JSON5Parser(),
		new SchemaParser(),
		new StandardFactory(new VideoStandardFactory(new RuleFactory(new CachingConditionFactory(new ConditionFactory()))))
	);

	const standard = await standardReader.read(path, verbose);

	// NB: This is broken!
	return standard as unknown as Rule[];
}
