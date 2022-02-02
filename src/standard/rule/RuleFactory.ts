import { ICondition } from '../condition/ICondition';
import { IConditionFactory } from '../condition/IConditionFactory';

import { Rule, RuleSchema, RuleSerialized } from './Rule';
import { IRuleFactory } from './IRuleFactory';
import { RuleType } from './RuleType';

export class RuleFactory implements IRuleFactory {
	private readonly conditionFactory: IConditionFactory;

	constructor(conditionFactory: IConditionFactory) {
		this.conditionFactory = conditionFactory;
	}

	create(serialized: RuleSerialized): Rule {
		const parsed = RuleSchema.parse(serialized);

		let conditions: ICondition[] = [];
		if (parsed.conditions) {
			conditions = parsed.conditions
				.map(condition => this.conditionFactory.create(condition));
		}

		switch (parsed.type) {
			case RuleType.ERROR:
			case RuleType.METADATA:
			default: {
				// TODO: Store the type, or specialise on it?
				return new Rule(parsed.mimeType, conditions);
			}
		}
	}
}
