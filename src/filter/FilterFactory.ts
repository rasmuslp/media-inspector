import fs from 'fs';
import util from 'util';

import JSON5 from 'json5';

import { ConditionFactory } from './filter-rule/condition/ConditionFactory';
import { Rule, RuleData } from './filter-rule/Rule';
import { RuleFactory } from './filter-rule/RuleFactory';

const readFileAsync = util.promisify(fs.readFile);

export class FilterFactory {
	static getFromSerialized(data): Rule[] {
		const ruleDatas = FilterFactory._parse(data);
		const rules = [];
		for (const ruleData of ruleDatas) {
			const rule = RuleFactory.getFromSerialized(ruleData);
			if (rule) {
				rules.push(rule);
			}
		}

		return rules;
	}

	static _parse(data): RuleData[] {
		try {
			const parsed = JSON5.parse(data) as RuleData[];
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

		// Transform loaded filter into Conditions
		// For each type
		for (const type in filterByType) {
			// Transform all the filters
			const transformedFilters = [];
			for (const filter of filterByType[type]) {
				// Transform all the conditions of a filter
				const transformedConditions = [];
				for (const condition of filter) {
					try {
						transformedConditions.push(ConditionFactory.getCondition(condition));
					}
					catch (e) {
						const filterNumber = transformedConditions.length + 1;
						throw new Error(`Could not construct Condition for '[${type}]#${filterNumber}': ${e.message}`);
					}
				}

				transformedFilters.push(transformedConditions);
			}

			filterByType[type] = transformedFilters;
		}

		return filterByType;
	}
}
