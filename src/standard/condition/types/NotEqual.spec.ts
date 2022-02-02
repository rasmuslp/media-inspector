import { NotEqual } from './NotEqual';

describe('NotEqual', () => {
	describe('path = \'the.path\', value = 7', () => {
		let condition: NotEqual;
		beforeAll(() => {
			condition = new NotEqual('the.path', 7);
		});

		describe('.check returns ConditionResult', () => {
			it('is satisfied for 5', () => {
				const result = condition.check(5);
				expect(result).toEqual(true);
			});

			it('is satisfied for \'7\'', () => {
				const result = condition.check('7');
				expect(result).toEqual(true);
			});

			it('is not satisfied for 7', () => {
				const result = condition.check(7);
				expect(result).toEqual(false);
			});
		});

		describe('.toStringForValue returns input value applied to types stringified', () => {
			it('handles 5', () => {
				const result = condition.toStringForValue(5);
				expect(result).toEqual('5 != 7');
			});
		});
	});

	describe('path = \'the.path\', value = \'match me\'', () => {
		let condition: NotEqual;
		beforeAll(() => {
			condition = new NotEqual('the.path', 'match me');
		});

		describe('.check returns ConditionResult', () => {
			it('is satisfied for \'hello\'', () => {
				const result = condition.check('hello');
				expect(result).toEqual(true);
			});

			it('is satisfied for \'match me\'', () => {
				const result = condition.check('match me');
				expect(result).toEqual(false);
			});
		});

		describe('.toStringForValue returns input value applied to types stringified', () => {
			it('handles \'match me\'', () => {
				const result = condition.toStringForValue('match me');
				expect(result).toEqual("'match me' != 'match me'");
			});
		});
	});
});
