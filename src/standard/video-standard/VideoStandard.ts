import { IVideoRule } from './IVideoRule';
import {
	IVideoErrorDetectorConfiguration
} from './VideoErrorDetectorConfiguration';

export class VideoStandard {
	public readonly videoErrorDetectorConfiguration: IVideoErrorDetectorConfiguration;

	public readonly rules: IVideoRule[];

	constructor(videoErrorDetectorConfiguration: IVideoErrorDetectorConfiguration, rules: IVideoRule[]) {
		this.videoErrorDetectorConfiguration = {
			demuxOnly: videoErrorDetectorConfiguration.demuxOnly ?? false
		};
		this.rules = rules;
	}
}
