import { Rule, RuleSerialized } from './Rule';

export interface IRuleFactory {
	create(serialized: RuleSerialized): Rule
}
