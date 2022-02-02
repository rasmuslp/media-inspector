import { Equal } from './Equal';

describe('Equal', () => {
	describe('path = \'the.path\', value = 7', () => {
		let condition: Equal;
		beforeAll(() => {
			condition = new Equal('the.path', 7);
		});

		describe('.check returns ConditionResult', () => {
			it('is not satisfied for 5', () => {
				const result = condition.check('5');
				expect(result).toEqual(false);
			});

			it('is not satisfied for \'7\'', () => {
				const result = condition.check('7');
				expect(result).toEqual(false);
			});

			it('is satisfied for 7', () => {
				const result = condition.check(7);
				expect(result).toEqual(true);
			});
		});

		describe('.toStringForValue returns input value applied to types stringified', () => {
			it('handles 5', () => {
				const result = condition.toStringForValue(5);
				expect(result).toEqual('5 = 7');
			});
		});
	});

	describe('path = \'the.path\', value = \'match me\'', () => {
		let condition: Equal;
		beforeAll(() => {
			condition = new Equal('the.path', 'match me');
		});

		describe('.check returns ConditionResult', () => {
			it('is not satisfied for \'hello\'', () => {
				const result = condition.check('hello');
				expect(result).toEqual(false);
			});

			it('is satisfied for \'match me\'', () => {
				const result = condition.check('match me');
				expect(result).toEqual(true);
			});
		});

		describe('.toStringForValue returns input value applied to types stringified', () => {
			it('handles \'match me\'', () => {
				const result = condition.toStringForValue('match me');
				expect(result).toEqual("'match me' = 'match me'");
			});
		});
	});
});
