import { IVideoStandard } from './video-standard/IVideoStandard';
import { IStandard } from './IStandard';

export class Standard implements IStandard {
	public readonly videoStandard;

	constructor(videoStandard: IVideoStandard) {
		this.videoStandard = videoStandard;
	}
}
