import { OperatorIn } from './OperatorIn';

describe('OperatorIn', () => {
	describe('path = \'the.path\', value = [10, \'hello there\', 5]', () => {
		let operator: OperatorIn;
		beforeAll(() => {
			operator = new OperatorIn('the.path', [10, 'hello there', 5]);
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

			it('is satisfied for \'hello there\'', () => {
				const result = operator.check('hello there');
				expect(result).toEqual(true);
			});
		});

		describe('.toStringForValue returns input value applied to operator stringified', () => {
			it('handles \'hello there\'', () => {
				const result = operator.toStringForValue('hello there');
				expect(result).toEqual("'hello there' in [10, 'hello there', 5]");
			});
		});
	});
});
