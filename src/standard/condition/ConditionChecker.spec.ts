import { LessThan } from './types/LessThan';
import { ConditionChecker } from './ConditionChecker';

describe('ConditionChecker', () => {
	describe('#getResultFor with LessThan', () => {
		let condition: LessThan;
		beforeEach(() => {
			condition = new LessThan('path', 10);
		});

		it('returns a satisfied ConditionResult for 5', () => {
			const result = ConditionChecker.getResultFor(condition, 5);
			expect(result.isSatisfied).toBe(true);
		});

		it('returns a not satisfied ConditionResult for 15', () => {
			const result = ConditionChecker.getResultFor(condition, 15);
			expect(result.isSatisfied).toBe(false);
		});
	});
});
