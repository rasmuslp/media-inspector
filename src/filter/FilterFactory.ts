import fs from 'fs';
import util from 'util';

import JSON5 from 'json5';

import { Rule, RuleData } from './rule/Rule';
import { RuleFactory } from './rule/RuleFactory';

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
}
