import { IRule } from '../rule/IRule';
import {
	IVideoErrorDetectorConfiguration
} from './VideoErrorDetectorConfiguration';

export class VideoStandard {
	public readonly videoErrorDetectorConfiguration: IVideoErrorDetectorConfiguration;

	public readonly rules: IRule[];

	constructor(videoErrorDetectorConfiguration: IVideoErrorDetectorConfiguration, rules: IRule[]) {
		this.videoErrorDetectorConfiguration = {
			demuxOnly: videoErrorDetectorConfiguration.demuxOnly ?? false
		};
		this.rules = rules;
	}
}
