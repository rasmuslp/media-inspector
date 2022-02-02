import { GreaterThanOrEqual } from './GreaterThanOrEqual';

describe('GreaterThanOrEqual', () => {
	describe('path = \'the.path\', value = 7', () => {
		let condition: GreaterThanOrEqual;
		beforeAll(() => {
			condition = new GreaterThanOrEqual('the.path', 7);
		});

		describe('.check returns ConditionResult', () => {
			it('is not satisfied for 5', () => {
				const result = condition.check(5);
				expect(result).toEqual(false);
			});

			it('is satisfied for 7', () => {
				const result = condition.check(7);
				expect(result).toEqual(true);
			});

			it('is satisfied for 11', () => {
				const result = condition.check(11);
				expect(result).toEqual(true);
			});
		});

		describe('.toStringForValue returns input value applied to types stringified', () => {
			it('handles 5', () => {
				const result = condition.toStringForValue(5);
				expect(result).toEqual('5 >= 7');
			});
		});
	});
});
