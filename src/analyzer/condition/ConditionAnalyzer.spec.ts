import { LessThan } from '../../standard/condition/types/LessThan';
import { ConditionAnalyzer } from './ConditionAnalyzer';
import { IConditionAnalyzer } from './IConditionAnalyzer';

describe('ConditionAnalyzer', () => {
	describe('analyze with LessThan', () => {
		let condition: LessThan;
		let conditionAnalyzer: IConditionAnalyzer;
		beforeEach(() => {
			condition = new LessThan('path', 10);
			conditionAnalyzer = new ConditionAnalyzer();
		});

		it('returns a satisfied ConditionResult for 5', () => {
			const result = conditionAnalyzer.analyze(condition, 5);
			expect(result.isSatisfied).toBe(true);
		});

		it('returns a not satisfied ConditionResult for 15', () => {
			const result = conditionAnalyzer.analyze(condition, 15);
			expect(result.isSatisfied).toBe(false);
		});
	});
});
