import cliProgress, { MultiBar, SingleBar } from 'cli-progress';
import createDebug from 'debug';
import pLimit from 'p-limit';

import { ErrorSummary } from '../../video-error-detector/ffmpeg/output-parser/ErrorSummary';
import { FFmpegVideoErrorDetector } from '../../video-error-detector/ffmpeg/FFmpegVideoErrorDetector';
import { File } from '../../fs-tree';

const debug = createDebug('decodeVideos');

export async function decodeVideos(videoFiles: File[], verbose: boolean, parallel: number, demuxOnly: boolean): Promise<Map<File, ErrorSummary>> {
	let summaryProgressBar: MultiBar|undefined;
	if (verbose) {
		summaryProgressBar = new MultiBar({
			clearOnComplete: false,
			hideCursor: true,
			noTTYOutput: Boolean(process.env.TERM === 'dumb' || !process.stdin.isTTY),

			format: '{bar} | {percentage}% | {fps} fps | Speed {speed} | {name} | {errors} errors',
			barCompleteChar: '\u2588',
			barIncompleteChar: '\u2591'

		}, cliProgress.Presets.shades_grey);
	}

	const errorSummaries = new Map<File, ErrorSummary>();

	const limiter = pLimit(parallel);
	const promises = videoFiles.map(videoFile => limiter(async () => {
		let fileProgressBar: SingleBar|undefined;
		if (verbose) {
			fileProgressBar = summaryProgressBar.create(100, 0);
		}
		const ffmpegVideoErrorDetector = new FFmpegVideoErrorDetector(videoFile.path);
		ffmpegVideoErrorDetector.addListener((progress, errorSummary) => {
			if (fileProgressBar) {
				fileProgressBar.update(progress.percentage, {
					fps: progress.fps,
					speed: progress.speed,
					name: videoFile.name,
					errors: errorSummary.streams + errorSummary.corruptDecodedFrames
				});
			}
		});

		let errorSummary: ErrorSummary;
		try {
			errorSummary = await ffmpegVideoErrorDetector.start(demuxOnly);
		}
		catch (error) {
			debug('Failed to run error detection on %s %s', videoFile.path, (error as Error).toString());
			throw error;
		}
		finally {
			if (fileProgressBar) {
				fileProgressBar.update(100);
				fileProgressBar.stop();
			}
		}

		errorSummaries.set(videoFile, errorSummary);
	}));

	debug('Decoding %d files', videoFiles.length);
	await Promise.all(promises);
	if (summaryProgressBar) {
		summaryProgressBar.stop();
	}

	return errorSummaries;
}
