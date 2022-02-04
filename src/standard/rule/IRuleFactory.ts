import { IRule } from './IRule';
import { RuleSerialized } from './RuleSchema';

export interface IRuleFactory {
	create(serialized: RuleSerialized): IRule
}
