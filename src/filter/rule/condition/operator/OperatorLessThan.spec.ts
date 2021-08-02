import { OperatorLessThan } from './OperatorLessThan';

describe('OperatorLessThan', () => {
	describe('path = \'the.path\', value = 7', () => {
		let operator: OperatorLessThan;
		beforeAll(() => {
			operator = new OperatorLessThan('the.path', 7);
		});

		describe('.check returns ConditionResult', () => {
			it('is satisfied for 5', () => {
				const result = operator.check(5);
				expect(result).toEqual(true);
			});

			it('is not satisfied for 7', () => {
				const result = operator.check(7);
				expect(result).toEqual(false);
			});

			it('is not satisfied for 11', () => {
				const result = operator.check(11);
				expect(result).toEqual(false);
			});
		});

		describe('.toStringForValue returns input value applied to operator stringified', () => {
			it('handles 5', () => {
				const result = operator.toStringForValue(5);
				expect(result).toEqual('5 < 7');
			});
		});
	});
});
