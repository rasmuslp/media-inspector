import { IRule } from './IRule';
import { RuleSerialized } from './rule-schema';

export interface IRuleFactory {
	create(serialized: RuleSerialized): IRule
}
