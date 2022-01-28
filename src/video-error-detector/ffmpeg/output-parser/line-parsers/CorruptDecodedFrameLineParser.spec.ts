import { CorruptDecodedFrameLineParser } from './CorruptDecodedFrameLineParser';

describe('CorruptDecodedFrameLineParser', () => {
	let corruptDecodedFrameLineParser: CorruptDecodedFrameLineParser;
	beforeEach(() => {
		corruptDecodedFrameLineParser = new CorruptDecodedFrameLineParser();
	});

	describe('.canParse', () => {
		it('identifies a line starting with \'[<stream> @ *]\' as a stream line', () => {
			const result = corruptDecodedFrameLineParser.canParse('./local-test-files/fail2.ts2: corrupt decoded frame in stream 0');
			expect(result).toEqual(true);
		});
	});

	describe('.parse', () => {
		let line: string;
		beforeEach(() => {
			line = './local-test-files/fail2.ts2: corrupt decoded frame in stream 0';
		});

		it('extracts the message', () => {
			const result = corruptDecodedFrameLineParser.parse(line);
			expect(result.message).toEqual('corrupt decoded frame in stream 0');
		});
	});
});
