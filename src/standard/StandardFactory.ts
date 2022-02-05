import { IVideoStandardFactory } from './video-standard/IVideoStandardFactory';
import { IStandardFactory } from './IStandardFactory';
import { Standard } from './Standard';
import { StandardDefinition } from './StandardSchema';

export class StandardFactory implements IStandardFactory {
	private readonly videoStandardFactory: IVideoStandardFactory;

	constructor(videoStandardFactory: IVideoStandardFactory) {
		this.videoStandardFactory = videoStandardFactory;
	}

	create(definition: StandardDefinition): Standard {
		const videoStandard = this.videoStandardFactory.create(definition.video);

		return new Standard(videoStandard);
	}
}
