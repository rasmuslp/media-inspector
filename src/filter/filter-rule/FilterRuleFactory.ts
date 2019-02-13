import { FilterConditionFactory } from './filter-condition/FilterConditionFactory';

import { FilterRule, FilterRuleData } from './FilterRule';

export class FilterRuleFactory {
	static getFromSerialized(data: FilterRuleData): FilterRule {
		/*
		switch (data.type) {
			case FilterRuleType.SEASON_SIZE_DISCREPANCY: {

			}
		}
		*/

		const castData = data as FilterRuleData; // TODO BETTER

		let conditions = [];
		if (castData.conditions) {
			conditions = castData.conditions
				.map(condition => FilterConditionFactory.getFilterCondition(condition))
				.filter(condition => condition);
		}

		return new FilterRule(data.mimeType, conditions);
	}
}
