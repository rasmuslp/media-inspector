import { Condition } from './condition/Condition';
import { ConditionFactory } from './condition/ConditionFactory';

import { Rule, RuleData } from './Rule';
import { RuleType } from './RuleType';

export class RuleFactory {
	static getFromSerialized(data: RuleData): Rule {
		let conditions: Condition[] = [];
		if (data.conditions) {
			conditions = data.conditions
				.map(condition => ConditionFactory.getSharedInstanceFromSerialized(condition));
		}

		switch (data.type) {
			case RuleType.DEFAULT:
			case RuleType.METADATA:
			default: {
				return new Rule(data.mimeType, conditions);
			}
		}
	}
}
