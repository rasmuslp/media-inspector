import path from 'path';

import cli from 'cli-ux';
import { SingleBar } from 'cli-progress';

import BaseCommand from '../BaseCommand';

import { FFmpegVideoErrorDetector } from '../../video-error-detector/ffmpeg/FFmpegVideoErrorDetector';
import { ErrorSummary } from '../../video-error-detector/ffmpeg/output-parser/ErrorSummary';

export default class CheckVideoForErrors extends BaseCommand {
	static description = 'Check a video for errors by decoding it'

	static args = [
		{
			name: 'videoPath',
			required: true,
			description: 'Path to video file',
			parse: (input: string): string => path.resolve(process.cwd(), input)
		}
	]

	static examples = [
		'$ media-inspector check-video-for-errors ./path/to/video.ts'
	]

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	async run() {
		const { args } = this.parse(CheckVideoForErrors);

		const videoPath = args.videoPath as string;
		const ffmpegVideoErrorDetector = new FFmpegVideoErrorDetector(videoPath);

		const progressBar = cli.progress({
			format: 'Progress | {bar} | {percentage}% | {fps} fps | Speed {speed}',
			barCompleteChar: '\u2588',
			barIncompleteChar: '\u2591'
		}) as SingleBar;

		ffmpegVideoErrorDetector.addListener((progress, errorSummary) => {
			progressBar.update(progress.percentage, {
				fps: progress.fps,
				speed: progress.speed
			});
		});

		progressBar.start(100, 0);
		let errorSummary: ErrorSummary;
		try {
			errorSummary = await ffmpegVideoErrorDetector.start();
		}
		catch (error) {
			this.error('Error occurred', error);
			throw error;
		}
		finally {
			progressBar.stop();
		}

		if (errorSummary?.corruptDecodedFrames || errorSummary?.streams) {
			this.log('Errors detected');
			this.log(`  Corrupted frames ${errorSummary.corruptDecodedFrames}`);
			this.log(`  Stream errors: ${errorSummary.streams}`);
			return;
		}

		this.log('OK');
	}
}
