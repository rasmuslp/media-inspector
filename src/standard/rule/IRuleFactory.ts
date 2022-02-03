import { Rule } from './Rule';
import { RuleSerialized } from './rule-schema';

export interface IRuleFactory {
	create(serialized: RuleSerialized): Rule
}
