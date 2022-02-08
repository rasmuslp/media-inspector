import { IVideoRule } from './IVideoRule';
import { IVideoRuleFactory } from './IVideoRuleFactory';
import { IVideoStandardFactory } from './IVideoStandardFactory';
import { IVideoErrorDetectorConfiguration } from './VideoErrorDetectorConfiguration';
import { VideoStandard } from './VideoStandard';
import { VideoStandardDefinition } from './VideoStandardSchema';

export class VideoStandardFactory implements IVideoStandardFactory {
	private readonly ruleFactory: IVideoRuleFactory;

	constructor(ruleFactory: IVideoRuleFactory) {
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

		const rules: IVideoRule[] = [];
		for (const rule of data.rules) {
			rules.push(this.ruleFactory.create(rule));
		}

		return new VideoStandard(videoErrorDetectorConfiguration, rules);
	}
}
