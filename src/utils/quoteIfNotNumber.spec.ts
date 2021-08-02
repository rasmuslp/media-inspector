import { quoteIfNotNumber } from './quoteIfNotNumber';

describe('quoteIfNotNumber', () => {
	it('converts the number 7', () => {
		const result = quoteIfNotNumber(7);
		expect(result).toBe('7');
	});

	it('converts the string \'test\'', () => {
		const result = quoteIfNotNumber('test');
		expect(result).toBe("'test'");
	});
});
