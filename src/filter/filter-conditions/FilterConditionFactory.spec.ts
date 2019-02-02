import { FilterConditionGe } from './FilterConditionGe';

import { FilterConditionFactory } from './FilterConditionFactory';

describe('#getFilterCondition', () => {
	test('identical conditions share the same FilterCondition', () => {
		// Conditions
		const condition1 = {
			path: 'p1',
			operator: '>=',
			value: 1
		};
		const condition2 = {
			path: 'p1',
			operator: '>=',
			value: 1
		};

		// Get FilterConditions
		const filterCondition1 = FilterConditionFactory.getFilterCondition(condition1);
		const filterCondition2 = FilterConditionFactory.getFilterCondition(condition2);

		expect(filterCondition1).toBeInstanceOf(FilterConditionGe);
		expect(filterCondition2).toBeInstanceOf(FilterConditionGe);

		expect(filterCondition1).toBe(filterCondition2);
	});
});
