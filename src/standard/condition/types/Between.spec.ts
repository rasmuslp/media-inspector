import { Between } from './Between';

describe('Between', () => {
	describe('path = \'the.path\', value = 7', () => {
		let condition: Between;
		beforeAll(() => {
			condition = new Between('the.path', [5, 10]);
		});

		describe('.check returns ConditionResult', () => {
			it('is satisfied for 5', () => {
				const result = condition.check(5);
				expect(result).toEqual(true);
			});

			it('is satisfied for 7', () => {
				const result = condition.check(7);
				expect(result).toEqual(true);
			});

			it('is not satisfied for 11', () => {
				const result = condition.check(11);
				expect(result).toEqual(false);
			});
		});

		describe('.toStringForValue returns input value applied to types stringified', () => {
			it('handles 7', () => {
				const result = condition.toStringForValue(7);
				expect(result).toEqual('5 <= 7 <= 10');
			});
		});
	});
});
