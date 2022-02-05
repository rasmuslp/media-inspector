import { JSON5Parser } from './JSON5Parser';

describe('JSON5Parser', () => {
	it('should throw error on empty string', () => {
		const parser = new JSON5Parser();
		expect(() => parser.parse('')).toThrowError('Could not parse JSON5 format: JSON5: invalid end of input at 1:1');
	});

	it('should parse JSON5', () => {
		const reader = new JSON5Parser();
		const parsed = reader.parse('{a:5}');
		expect(parsed).toStrictEqual({
			a: 5
		});
	});
});
