import { IRule } from '../rule/IRule';
import {
	IVideoErrorDetectorConfiguration
} from './VideoErrorDetectorConfiguration';

export class VideoStandard {
	private readonly videoErrorDetectorConfiguration: IVideoErrorDetectorConfiguration;

	private readonly rules: IRule[];

	constructor(videoErrorDetectorConfiguration: IVideoErrorDetectorConfiguration, rules: IRule[]) {
		this.videoErrorDetectorConfiguration = {
			demuxOnly: videoErrorDetectorConfiguration.demuxOnly ?? false
		};
		this.rules = rules;
	}
}
