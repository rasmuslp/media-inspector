import { VideoStandard } from './VideoStandard';
import { VideoStandardDefinition } from './VideoStandardSchema';

export interface IVideoStandardFactory {
	create(data: VideoStandardDefinition): VideoStandard
}
