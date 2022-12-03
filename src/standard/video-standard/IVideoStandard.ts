import { IVideoErrorDetectorConfiguration } from './VideoErrorDetectorConfiguration';
import { IVideoRule } from './IVideoRule';

export interface IVideoStandard {
	readonly videoErrorDetectorConfiguration: IVideoErrorDetectorConfiguration;
	readonly rules: IVideoRule[];
}
