import { getPercentageCompleted, stringToDuration, stringToDurationInMillis } from './duration-helpers';

describe('duration-helpers', () => {
	describe('stringToDuration', () => {
		it('correctly converts \'00:02:54.31\'', () => {
			const result = stringToDuration('00:02:54.31');
			expect(result.toMillis()).toEqual(174310);
		});

		it('correctly converts \'00:29:00.08\'', () => {
			const result = stringToDuration('00:29:00.08');
			expect(result.toMillis()).toEqual(1740080);
		});
	});

	describe('stringToDurationInMillis', () => {
		it('correctly converts \'00:02:54.31\'', () => {
			const result = stringToDurationInMillis('00:02:54.31');
			expect(result).toEqual(174310);
		});

		it('correctly converts \'00:29:00.08\'', () => {
			const result = stringToDurationInMillis('00:29:00.08');
			expect(result).toEqual(1740080);
		});
	});

	describe('getPercentageCompleted', () => {
		it('returns 0', () => {
			const result = getPercentageCompleted(0, 1);
			expect(result).toEqual(0);
		});

		it('returns 33.33 rounding to max two digits', () => {
			const result = getPercentageCompleted(3, 9);
			expect(result).toEqual(33.33);
		});

		it('returns 50', () => {
			const result = getPercentageCompleted(1, 2);
			expect(result).toEqual(50);
		});

		it('returns 67.9', () => {
			const result = getPercentageCompleted(678999, 1000000);
			expect(result).toEqual(67.9);
		});

		it('returns 100', () => {
			const result = getPercentageCompleted(1, 1);
			expect(result).toEqual(100);
		});
	});
});
