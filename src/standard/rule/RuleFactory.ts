import { IConditionFactory } from '../condition/IConditionFactory';

import { IRule } from './IRule';
import { IRuleFactory } from './IRuleFactory';
import { Rule } from './Rule';
import { RuleSerialized } from './RuleSchema';

export class RuleFactory implements IRuleFactory {
	private readonly conditionFactory: IConditionFactory;

	constructor(conditionFactory: IConditionFactory) {
		this.conditionFactory = conditionFactory;
	}

	create(serialized: RuleSerialized): IRule {
		const conditions = serialized.conditions.map(condition => this.conditionFactory.create(condition));

		return new Rule(serialized.name, serialized.match, serialized.type, conditions);
	}
}
