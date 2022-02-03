import { VideoStandardDefinition } from '../schema/Video';
import { VideoStandard } from './VideoStandard';

export interface IVideoStandardFactory {
	create(data: VideoStandardDefinition): VideoStandard
}
