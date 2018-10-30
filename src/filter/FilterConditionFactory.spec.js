const FilterConditionGe = require('./filter-conditions/FilterConditionGe');
const FilterConditionFactory = require('./FilterConditionFactory').constructor;

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
		const filterConditionFactory = new FilterConditionFactory();
		const filterCondition1 = filterConditionFactory.getFilterCondition(condition1);
		const filterCondition2 = filterConditionFactory.getFilterCondition(condition2);

		expect(filterCondition1).toBeInstanceOf(FilterConditionGe);
		expect(filterCondition2).toBeInstanceOf(FilterConditionGe);

		expect(filterCondition1).toBe(filterCondition2);
	});
});
