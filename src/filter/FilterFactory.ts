import fs from 'fs';
import util from 'util';

import JSON5 from 'json5';

import { FilterConditionFactory } from './filter-condition/FilterConditionFactory';

const readFileAsync = util.promisify(fs.readFile);
import {FilterRule, FilterRuleData} from './filter-rule/FilterRule';
import {FilterRuleFactory} from './filter-rule/FilterRuleFactory';

export class FilterFactory {
	static getFromSerialized(data): FilterRule[] {
		const filterRuleDatas = FilterFactory._parse(data);
		const filterRules = [];
		for (const filterRuleData of filterRuleDatas) {
			const filterRule = FilterRuleFactory.getFromSerialized(filterRuleData);
			if (filterRule) {
				filterRules.push(filterRule);
			}
		}

		return filterRules;
	}

	static _parse(data): FilterRuleData[] {
		try {
			const parsed = <FilterRuleData[]> JSON5.parse(data);
			return parsed;
		}
		catch (e) {
			throw new Error(`Could not parse filter: ${e.message}`);
		}
	}

	static async _readFromFile(filterPath) {
		// Load filter
		let filterByType;
		try {
			const data = await readFileAsync(filterPath);
			filterByType = JSON5.parse(data);
		}
		catch (e) {
			throw new Error(`Could not read and parse filter at '${filterPath}': ${e.message}`);
		}

		return filterByType;
	}

	static async getFromFile(filterPath) {
		const filterByType = await FilterFactory._readFromFile(filterPath);

		// Transform loaded filter into FilterConditions
		// For each type
		for (const type in filterByType) {
			// Transform all the filters
			const transformedFilters = [];
			for (const filter of filterByType[type]) {
				// Transform all the conditions of a filter
				const transformedConditions = [];
				for (const condition of filter) {
					try {
						transformedConditions.push(FilterConditionFactory.getFilterCondition(condition));
					}
					catch (e) {
						const filterNumber = transformedConditions.length + 1;
						throw new Error(`Could not construct FilterCondition for '[${type}]#${filterNumber}': ${e.message}`);
					}
				}

				transformedFilters.push(transformedConditions);
			}

			filterByType[type] = transformedFilters;
		}

		return filterByType;
	}
}
