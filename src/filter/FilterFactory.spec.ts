import fs from 'fs';
import util from 'util';

import { Condition } from './rule/condition/Condition';
import { FilterFactory } from './FilterFactory';
import { Rule } from './rule/Rule';

const readFileAsync = util.promisify(fs.readFile);

describe('FilterFactory', () => {
	const filterPath = 'test-assets/filter-simple.json5';

	test(`can getFromSerialized '${filterPath}'`, async () => {
		const data = await readFileAsync(filterPath, 'utf8');

		const rules = FilterFactory.getFromSerialized(data);

		// Test content of loaded rules
		expect(Array.isArray(rules)).toBe(true);
		for (const rule of rules) {
			expect(rule).toBeInstanceOf(Rule);
			for (const condition of rule._conditions) {
				expect(condition).toBeInstanceOf(Condition);
			}
		}
	});
});
