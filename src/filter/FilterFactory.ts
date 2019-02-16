import JSON5 from 'json5';

import { Rule, RuleData } from './rule/Rule';
import { RuleFactory } from './rule/RuleFactory';

export class FilterFactory {
	static getFromSerialized(data): Rule[] {
		const ruleDatas = FilterFactory._parse(data);
		const rules = [];
		for (const ruleData of ruleDatas) {
			const rule = RuleFactory.getFromSerialized(ruleData);
			rules.push(rule);
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
}
