import { LastMessageRepeatedLineParser } from './LastMessageRepeatedLineParser';

describe('LastMessageRepeatedLineParser', () => {
	let lastMessageRepeatedLineParser: LastMessageRepeatedLineParser;
	beforeEach(() => {
		lastMessageRepeatedLineParser = new LastMessageRepeatedLineParser();
	});

	describe(',canParse', () => {
		it('identifies a line starting with \'[<stream> @ *]\' as a stream line', () => {
			const result = lastMessageRepeatedLineParser.canParse('    Last message repeated 1 times');
			expect(result).toEqual(true);
		});
	});

	describe('.parse', () => {
		it('extracts the repeat count as 1', () => {
			const result = lastMessageRepeatedLineParser.parse('    Last message repeated 1 times');
			expect(result.count).toEqual(1);
		});

		it('extracts the repeat count as 18', () => {
			const result = lastMessageRepeatedLineParser.parse('    Last message repeated 18 times');
			expect(result.count).toEqual(18);
		});
	});
});
