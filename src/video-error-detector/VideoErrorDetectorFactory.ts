import { FFmpegVideoErrorDetector } from './ffmpeg/FFmpegVideoErrorDetector';
import { IVideoErrorDetector } from './IVideoErrorDetector';
import { IVideoErrorDetectorFactory } from './IVideoErrorDetectorFactory';

export class VideoErrorDetectorFactory implements IVideoErrorDetectorFactory {
	public create(path: string): IVideoErrorDetector {
		return new FFmpegVideoErrorDetector(path);
	}
}
