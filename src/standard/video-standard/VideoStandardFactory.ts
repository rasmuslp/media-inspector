import { IRule } from '../rule/IRule';
import { IRuleFactory } from '../rule/IRuleFactory';
import { IVideoStandardFactory } from './IVideoStandardFactory';
import { IVideoErrorDetectorConfiguration } from './VideoErrorDetectorConfiguration';
import { VideoStandard } from './VideoStandard';
import { VideoStandardDefinition } from './VideoStandardSchema';

export class VideoStandardFactory implements IVideoStandardFactory {
	private readonly ruleFactory: IRuleFactory;

	constructor(ruleFactory: IRuleFactory) {
		this.ruleFactory = ruleFactory;
	}

	create(data: VideoStandardDefinition): VideoStandard {
		const videoErrorDetectorConfiguration: IVideoErrorDetectorConfiguration = {};
		if (data['error-detector']) {
			const demuxOnly = data['error-detector']['demux-only'];
			if (demuxOnly) {
				videoErrorDetectorConfiguration.demuxOnly = demuxOnly;
			}
		}

		const rules: IRule[] = [];
		for (const rule of data.rules) {
			rules.push(this.ruleFactory.create(rule));
		}

		return new VideoStandard(videoErrorDetectorConfiguration, rules);
	}
}
