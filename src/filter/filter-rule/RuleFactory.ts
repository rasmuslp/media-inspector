import { ConditionFactory } from './condition/ConditionFactory';

import { Rule, RuleData } from './Rule';

export class RuleFactory {
	static getFromSerialized(data: RuleData): Rule {
		/*
		switch (data.type) {
			case RuleType.SEASON_SIZE_DISCREPANCY: {

			}
		}
		*/

		const castData = data as RuleData; // TODO BETTER

		let conditions = [];
		if (castData.conditions) {
			conditions = castData.conditions
				.map(condition => ConditionFactory.getCondition(condition))
				.filter(condition => condition);
		}

		return new Rule(data.mimeType, conditions);
	}
}
