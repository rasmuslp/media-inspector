import { OutputParser } from './OutputParser';
import { getCleanFullSample, getMetadataInputSample1 } from '../../../../test-assets/ffmpeg-example-outputs';
import { Progress } from './Progress';

describe('OutputParser', () => {
	let outputParser: OutputParser;
	beforeEach(() => {
		outputParser = new OutputParser();
	});

	describe('.parse', () => {
		it('handles corrupt decoded frame line', () => {
			const input = './local-test-files/fail2.ts2: corrupt decoded frame in stream 0';
			const [, errorSummary] = outputParser.parse(input);
			expect(errorSummary.corruptDecodedFrames).toEqual(1);
		});

		it('handles last message repeated line', () => {
			const parseSpy = jest.spyOn(outputParser, 'parse');

			const input = './local-test-files/fail2.ts2: corrupt decoded frame in stream 0';
			let [, errorSummary] = outputParser.parse(input);
			expect(errorSummary.corruptDecodedFrames).toEqual(1);

			const repeatLine = '    Last message repeated 1 times';
			[, errorSummary] = outputParser.parse(repeatLine);
			expect(errorSummary.corruptDecodedFrames).toEqual(2);
			expect(parseSpy).toBeCalledTimes(3);
		});

		it('yields progress stats on frame lines without percentage when duration is unknown', () => {
			const input = 'frame= 3107 fps=1235 q=-0.0 size=N/A time=00:02:04.56 bitrate=N/A speed=49.5x    ';
			const [progress] = outputParser.parse(input);
			expect(progress).toEqual({
				percentage: 0
			});
		});

		it('yields progress stats on frame line with percentage when duration is known', () => {
			const testLines = getMetadataInputSample1();
			for (const line of testLines) {
				outputParser.parse(line);
			}
			const [progress] = outputParser.parse('frame= 3107 fps=1235 q=-0.0 size=N/A time=00:02:04.56 bitrate=N/A speed=49.5x    ');

			expect(progress).toEqual({
				percentage: 71.46
			});
		});
	});

	describe('.parse with clean sample', () => {
		it('yields progress stats on frame lines', () => {
			const testLines = getCleanFullSample();
			let progressUpdates: Progress[] = [];
			for (const line of testLines) {
				const [progress] = outputParser.parse(line);
				progressUpdates.push(progress);
			}

			progressUpdates = progressUpdates.filter(progress => progress.percentage !== 0);

			expect(progressUpdates).toEqual([{
				percentage: 0.15
			}, {
				percentage: 15.38
			}, {
				percentage: 29.16
			}, {
				percentage: 43.68
			}, {
				percentage: 57.78
			}, {
				percentage: 71.46
			}, {
				percentage: 85
			}, {
				percentage: 99.85
			}, {
				percentage: 99.85
			}]);
		});
	});
});
