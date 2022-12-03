import { IVideoRule } from './IVideoRule';
import { VideoRuleSerialized } from './VideoStandardSchema';

export interface IVideoRuleFactory {
	create(serialized: VideoRuleSerialized): IVideoRule;
}
