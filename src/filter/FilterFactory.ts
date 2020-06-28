import * as t from 'io-ts';
import JSON5 from 'json5';

import { Rule, TRule } from './rule/Rule';
import { RuleFactory } from './rule/RuleFactory';
import { decodeTo } from '../lib/io-ts';

export const TFilter = t.array(TRule);
export type FilterData = t.TypeOf<typeof TFilter>;

export class FilterFactory {
	static getFromSerialized(data: string): Rule[] {
		const parsed = FilterFactory._parse(data);
		const validatedRuleDatas = decodeTo(TFilter, parsed);
		const rules: Rule[] = [];
		for (const ruleData of validatedRuleDatas) {
			const rule = RuleFactory.getFromSerialized(ruleData);
			rules.push(rule);
		}

		return rules;
	}

	static _parse(data: string): FilterData {
		try {
			const parsed = JSON5.parse(data) as FilterData;
			return parsed;
		}
		catch (e) {
			throw new Error(`Could not parse filter: ${(e as Error).message}`);
		}
	}
}
