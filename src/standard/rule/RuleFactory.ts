import { ICondition } from '../condition/ICondition';
import { ConditionFactory } from '../condition/ConditionFactory';

import { Rule, RuleSchema, RuleSerialized } from './Rule';
import { RuleType } from './RuleType';

export class RuleFactory {
	static getFromSerialized(serialized: RuleSerialized): Rule {
		const parsed = RuleSchema.parse(serialized);

		let conditions: ICondition[] = [];
		if (parsed.conditions) {
			conditions = parsed.conditions
				.map(condition => ConditionFactory.getSharedInstanceFromSerialized(condition));
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
