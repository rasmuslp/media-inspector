import { ProgressLineParser } from './ProgressLineParser';

describe('ProgressLineParser', () => {
	let progressLineParser: ProgressLineParser;
	beforeEach(() => {
		progressLineParser = new ProgressLineParser();
	});

	describe('.canParse', () => {
		it('identifies a line starting with \'frame\' as a progress line', () => {
			const result = progressLineParser.canParse('frame= 3697');
			expect(result).toEqual(true);
		});
	});

	describe('.parse', () => {
		let line: string;
		beforeEach(() => {
			line = 'frame= 3697 fps=1225 q=-0.0 size=N/A time=00:02:28.16 bitrate=N/A speed=  49.1x    ';
		});

		it('gets frame counter as a number with 1 space separator after =', () => {
			const result = progressLineParser.parse(line);
			expect(result.frame).toEqual(3697);
		});

		it('gets fps as a number', () => {
			const result = progressLineParser.parse(line);
			expect(result.fps).toEqual(1225);
		});

		it('gets q as a string', () => {
			const result = progressLineParser.parse(line);
			expect(result.q).toEqual('-0.0');
		});

		it('fails to get size', () => {
			const result = progressLineParser.parse(line);
			expect(result.size).toEqual('N/A');
		});

		it('gets time as a string', () => {
			const result = progressLineParser.parse(line);
			expect(result.time).toEqual('00:02:28.16');
		});

		it('fails to get bitrate', () => {
			const result = progressLineParser.parse(line);
			expect(result.bitrate).toEqual('N/A');
		});

		it('gets speed as a string with 2 space separators after =', () => {
			const result = progressLineParser.parse(line);
			expect(result.speed).toEqual('49.1x');
		});
	});
});
