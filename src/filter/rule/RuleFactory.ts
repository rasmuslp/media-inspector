import { Condition } from './condition/Condition';
import { ConditionFactory } from './condition/ConditionFactory';

import { Rule, RuleSchema, RuleSerialized } from './Rule';
import { RuleType } from './RuleType';

export class RuleFactory {
	static getFromSerialized(serialized: RuleSerialized): Rule {
		const parsed = RuleSchema.parse(serialized);

		let conditions: Condition[] = [];
		if (parsed.conditions) {
			conditions = parsed.conditions
				.map(condition => ConditionFactory.getSharedInstanceFromSerialized(condition));
		}

		switch (parsed.type) {
			case RuleType.DEFAULT:
			case RuleType.METADATA:
			default: {
				return new Rule(parsed.mimeType, conditions);
			}
		}
	}
}
