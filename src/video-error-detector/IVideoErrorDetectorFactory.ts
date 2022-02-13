import { IVideoErrorDetector } from './IVideoErrorDetector';

export interface IVideoErrorDetectorFactory {
	create(path: string): IVideoErrorDetector;
}
