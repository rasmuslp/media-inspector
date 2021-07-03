import { StreamLineParser } from './StreamLineParser';

describe('StreamLineParser', () => {
	let streamLineParser: StreamLineParser;
	beforeEach(() => {
		streamLineParser = new StreamLineParser();
	});

	describe('canParse', () => {
		it('identifies a line starting with \'[<stream> @ *]\' as a stream line', () => {
			const result = streamLineParser.canParse('[mpegts @ 0x7fa5e4816a00] DTS discontinuity in stream 0: packet 5 with DTS 208927, packet 6 with DTS 31089727');
			expect(result).toEqual(true);
		});
	});

	describe('parse', () => {
		let line;
		beforeEach(() => {
			line = '[h264 @ 0x7fa5e4833c00] concealing 3089 DC, 3089 AC, 3089 MV errors in I frame';
		});

		it('extracts the stream type', () => {
			const result = streamLineParser.parse(line);
			expect(result.type).toEqual('h264');
		});

		it('extracts the message', () => {
			const result = streamLineParser.parse(line);
			expect(result.message).toEqual('concealing 3089 DC, 3089 AC, 3089 MV errors in I frame');
		});
	});
});
