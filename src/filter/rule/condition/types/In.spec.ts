import { In } from './In';

describe('In', () => {
	describe('path = \'the.path\', value = [10, \'hello there\', 5]', () => {
		let condition: In;
		beforeAll(() => {
			condition = new In('the.path', [10, 'hello there', 5]);
		});

		describe('.check returns ConditionResult', () => {
			it('is satisfied for 5', () => {
				const result = condition.check(5);
				expect(result).toEqual(true);
			});

			it('is not satisfied for 7', () => {
				const result = condition.check(7);
				expect(result).toEqual(false);
			});

			it('is satisfied for \'hello there\'', () => {
				const result = condition.check('hello there');
				expect(result).toEqual(true);
			});
		});

		describe('.toStringForValue returns input value applied to types stringified', () => {
			it('handles \'hello there\'', () => {
				const result = condition.toStringForValue('hello there');
				expect(result).toEqual("'hello there' in [10, 'hello there', 5]");
			});
		});
	});
});
