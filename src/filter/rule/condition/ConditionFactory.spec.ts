import { ConditionGreaterThanOrEqual } from './operators/ConditionGreaterThanOrEqual';

import { ConditionFactory } from './ConditionFactory';
import { ConditionOperator } from './ConditionOperator';

describe('#getSharedInstanceFromSerialized', () => {
	test('identical conditions share the same Condition', () => {
		// Conditions
		const conditionData1 = {
			path: 'p1',
			operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
			value: 1
		};
		const conditionData2 = {
			path: 'p1',
			operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
			value: 1
		};

		// Get Conditions
		const condition1 = ConditionFactory.getSharedInstanceFromSerialized(conditionData1);
		const condition2 = ConditionFactory.getSharedInstanceFromSerialized(conditionData2);

		expect(condition1).toBeInstanceOf(ConditionGreaterThanOrEqual);
		expect(condition2).toBeInstanceOf(ConditionGreaterThanOrEqual);

		expect(condition1).toBe(condition2);
	});
});
