import path from 'path';

import { flags } from '@oclif/command';
import createDebug from 'debug';

import { decodeVideos } from '../helpers/decodeVideo';
import { readTreeAndVideos } from '../helpers/readTreeAndVideos';
import BaseCommand from '../BaseCommand';
import { verbose } from '../flags';

const debug = createDebug('VideoErrors');

export default class VideoErrors extends BaseCommand {
	static description = 'Checks video files for errors by decoding them';

	static args = [
		{
			name: 'videoPath',
			required: true,
			description: 'Path to video file or directory of video files',
			parse: (input: string): string => path.resolve(process.cwd(), input)
		}
	];

	static flags = {
		ext: flags.build({
			char: 'e',
			default: undefined,
			description: 'File extensions to match - default: all',
			parse: input => input.split(','),
			required: false
		})(),

		parallel: flags.integer({
			char: 'p',
			default: () => 1,
			description: 'Number of parallel processes to utilise for decoding - default: 1',
			required: true
		}),

		'demux-only': flags.boolean({
			char: 'd',
			default: false,
			description: 'Skip decode and demux only'
		}),

		verbose
	};

	static examples = [
		'$ media-inspector video-errors ./path/to/video.ext',
		'$ media-inspector video-errors ./path/to/directory-with-video-files',
		'$ media-inspector video-errors ./path/to/directory-with-video-files --ext .ts,.mp4 --parallel 4'
	];

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	async run() {
		const { args, flags } = this.parse(VideoErrors);

		const videoPath = args.videoPath as string;
		const { videoFiles } = await readTreeAndVideos(videoPath, flags.verbose);
		let videoFilesFilteredByExtension = videoFiles;
		if (flags.ext) {
			videoFilesFilteredByExtension = videoFiles.filter(file => flags.ext.includes(file.extension));
		}
		debug('Found %d video files matching extension', videoFilesFilteredByExtension.length);

		if (flags.verbose) {
			this.log(`Found ${videoFilesFilteredByExtension.length} video files matching extension`);
		}

		const errorSummaries = await decodeVideos(videoFilesFilteredByExtension, flags.verbose, flags.parallel, flags['demux-only']);

		for (const [file, errorSummary] of errorSummaries.entries()) {
			if (errorSummary?.corruptDecodedFrames || errorSummary?.streams) {
				this.log(`Errors detected in ${file.path}`);
				this.log(`  Corrupted frames ${errorSummary.corruptDecodedFrames}`);
				this.log(`  Stream errors: ${errorSummary.streams}`);
			}
		}
	}
}
