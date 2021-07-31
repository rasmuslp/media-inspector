import { OperatorNotEqual } from './OperatorNotEqual';

describe('OperatorNotEqual', () => {
	describe('path = \'the.path\', value = 7', () => {
		let operator: OperatorNotEqual;
		beforeAll(() => {
			operator = new OperatorNotEqual('the.path', 7);
		});

		describe('.check returns ConditionResult', () => {
			it('is satisfied for 5', () => {
				const result = operator.check(5);
				expect(result.isSatisfied).toEqual(true);
			});

			it('is satisfied for \'7\'', () => {
				const result = operator.check('7');
				expect(result.isSatisfied).toEqual(true);
			});

			it('is not satisfied for 7', () => {
				const result = operator.check(7);
				expect(result.isSatisfied).toEqual(false);
			});
		});

		describe('.toStringForValue returns input value applied to operator stringified', () => {
			it('handles 5', () => {
				const result = operator.toStringForValue(5);
				expect(result).toEqual('5 != 7');
			});
		});
	});

	describe('path = \'the.path\', value = \'match me\'', () => {
		let operator: OperatorNotEqual;
		beforeAll(() => {
			operator = new OperatorNotEqual('the.path', 'match me');
		});

		describe('.check returns ConditionResult', () => {
			it('is satisfied for \'hello\'', () => {
				const result = operator.check('hello');
				expect(result.isSatisfied).toEqual(true);
			});

			it('is satisfied for \'match me\'', () => {
				const result = operator.check('match me');
				expect(result.isSatisfied).toEqual(false);
			});
		});

		describe('.toStringForValue returns input value applied to operator stringified', () => {
			it('handles \'match me\'', () => {
				const result = operator.toStringForValue('match me');
				// TODO: Quote strings
				expect(result).toEqual('match me != match me');
			});
		});
	});
});
