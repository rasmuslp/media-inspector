import { MediaFile } from './MediaFile';
import {MediainfoMetadataFactory} from './MediainfoMetadataFactory';

export class VideoFile extends MediaFile {
	async readMetadataFromFileSystem() {
		const metadata = await MediainfoMetadataFactory.getFromFile(this.path);
		this.metadata = metadata;
	}
}
