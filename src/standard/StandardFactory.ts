import { StandardDefinition } from './schema/Standard';
import { IVideoStandardFactory } from './video/IVideoStandardFactory';
import { IStandardFactory } from './IStandardFactory';
import { Standard } from './Standard';

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
