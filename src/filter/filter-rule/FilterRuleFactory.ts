import { FilterConditionFactory } from '../filter-condition/FilterConditionFactory';

import { FilterRule, FilterRuleData, FilterRuleType } from './FilterRule';
import { FilterMetadataRule, FilterMetadataRuleData } from './FilterMetadataRule';

export class FilterRuleFactory {
	static getFromSerialized(data: FilterRuleData): FilterRule {
		switch (data.type) {
			case FilterRuleType.METADATA: {
				const castData = data as FilterMetadataRuleData; // TODO BETTER

				const conditions = castData.conditions
					.map(condition => FilterConditionFactory.getFilterCondition(condition))
					.filter(condition => condition);

				return new FilterMetadataRule(data.mimeType, conditions);
			}
		}
	}
}
