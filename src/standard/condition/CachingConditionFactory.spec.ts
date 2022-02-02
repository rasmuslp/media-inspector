import { GreaterThanOrEqual } from './types/GreaterThanOrEqual';
import { CachingConditionFactory } from './CachingConditionFactory';
import { IConditionFactory } from './IConditionFactory';
import { Operator } from './Operator';
import { ConditionFactory } from './ConditionFactory';

describe('CachingConditionFactory', () => {
	let cachingConditionFactory: IConditionFactory;
	beforeEach(() => {
		cachingConditionFactory = new CachingConditionFactory(new ConditionFactory());
	});

	describe('create', () => {
		it('should return the same Condition object for identical definitions of conditions', () => {
			// Conditions
			const conditionData1 = {
				path: 'p1',
				operator: Operator.GREATER_THAN_OR_EQUAL,
				value: 1
			};
			const conditionData2 = {
				path: 'p1',
				operator: Operator.GREATER_THAN_OR_EQUAL,
				value: 1
			};

			// Get Conditions
			const condition1 = cachingConditionFactory.create(conditionData1);
			const condition2 = cachingConditionFactory.create(conditionData2);

			expect(condition1).toBeInstanceOf(GreaterThanOrEqual);
			expect(condition2).toBeInstanceOf(GreaterThanOrEqual);

			expect(condition1).toBe(condition2);
		});
	});
});
