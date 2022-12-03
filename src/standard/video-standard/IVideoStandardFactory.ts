import { IVideoStandard } from './IVideoStandard';
import { VideoStandardDefinition } from './VideoStandardSchema';

export interface IVideoStandardFactory {
	create(data: VideoStandardDefinition): IVideoStandard;
}
