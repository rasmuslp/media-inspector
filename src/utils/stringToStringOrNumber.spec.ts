import { stringToStringOrNumber } from './stringToStringOrNumber';

describe('stringToStringOrNumber', () => {
	it('converts \'2\' to a Number', () => {
		const result = stringToStringOrNumber('2');
		expect(result).toBe(2);
	});

	it('leaves \'5hello\' as String', () => {
		const result = stringToStringOrNumber('5hello');
		expect(result).toBe('5hello');
	});

	it('converts \'Hello World\' to a lower case String', () => {
		const result = stringToStringOrNumber('Hello World');
		expect(result).toBe('hello world');
	});
});
