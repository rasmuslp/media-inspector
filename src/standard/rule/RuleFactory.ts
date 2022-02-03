import { IConditionFactory } from '../condition/IConditionFactory';

import { Rule } from './Rule';
import { IRuleFactory } from './IRuleFactory';
import { RuleSerialized } from './rule-schema';

export class RuleFactory implements IRuleFactory {
	private readonly conditionFactory: IConditionFactory;

	constructor(conditionFactory: IConditionFactory) {
		this.conditionFactory = conditionFactory;
	}

	create(serialized: RuleSerialized): Rule {
		const conditions = serialized.conditions.map(condition => this.conditionFactory.create(condition));

		return new Rule(serialized.name, serialized.match, serialized.type, conditions);
	}
}
