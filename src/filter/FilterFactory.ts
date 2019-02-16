import * as t from 'io-ts';
import JSON5 from 'json5';

import { Rule, RuleDataValidator } from './rule/Rule';
import { RuleFactory } from './rule/RuleFactory';
import { decodeTo } from '../lib/io-ts';

export const FilterDataValidator = t.array(RuleDataValidator);

export type FilterData = t.TypeOf<typeof FilterDataValidator>;

export class FilterFactory {
	static getFromSerialized(data): Rule[] {
		const parsed = FilterFactory._parse(data);
		const validatedRuleDatas = decodeTo(FilterDataValidator, parsed);
		const rules = [];
		for (const ruleData of validatedRuleDatas) {
			const rule = RuleFactory.getFromSerialized(ruleData);
			rules.push(rule);
		}

		return rules;
	}

	static _parse(data): unknown {
		try {
			const parsed = JSON5.parse(data);
			return parsed;
		}
		catch (e) {
			throw new Error(`Could not parse filter: ${e.message}`);
		}
	}
}
