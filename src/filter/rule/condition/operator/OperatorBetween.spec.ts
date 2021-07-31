import { OperatorBetween } from './OperatorBetween';

describe('OperatorBetween', () => {
	describe('path = \'the.path\', value = 7', () => {
		let operator: OperatorBetween;
		beforeAll(() => {
			operator = new OperatorBetween('the.path', [5, 10]);
		});

		describe('.check returns ConditionResult', () => {
			it('is satisfied for 5', () => {
				const result = operator.check('5');
				expect(result.isSatisfied).toEqual(true);
			});

			it('is satisfied for 7', () => {
				const result = operator.check('7');
				expect(result.isSatisfied).toEqual(true);
			});

			it('is not satisfied for 11', () => {
				const result = operator.check('11');
				expect(result.isSatisfied).toEqual(false);
			});
		});

		describe('.toStringForValue returns input value applied to operator stringified', () => {
			it('handles 7', () => {
				const result = operator.toStringForValue(7);
				expect(result).toEqual('5 <= 7 <= 10');
			});
		});
	});
});
