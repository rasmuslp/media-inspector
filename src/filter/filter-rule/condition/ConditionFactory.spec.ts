import { ConditionGe } from './ConditionGe';

import { ConditionFactory } from './ConditionFactory';

describe('#getCondition', () => {
	test('identical conditions share the same Condition', () => {
		// Conditions
		const conditionData1 = {
			path: 'p1',
			operator: '>=',
			value: 1
		};
		const conditionData2 = {
			path: 'p1',
			operator: '>=',
			value: 1
		};

		// Get Conditions
		const condition1 = ConditionFactory.getCondition(conditionData1);
		const condition2 = ConditionFactory.getCondition(conditionData2);

		expect(condition1).toBeInstanceOf(ConditionGe);
		expect(condition2).toBeInstanceOf(ConditionGe);

		expect(condition1).toBe(condition2);
	});
});
