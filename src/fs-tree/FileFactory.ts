import mime from 'mime-types';

import { Serialized } from './Serialized';
import { SerializedFileData, File } from './File';
import { VideoFile } from './VideoFile';
import { MediainfoMetadataFactory } from './MediainfoMetadataFactory';
import { SerializedMediaFileData } from './MediaFile';

export class FileFactory {
	static createFileFrom(nodePath: string, stats): File {
		const mimeType = mime.lookup(nodePath) || 'application/octet-stream';
		const type = File.getTypeFrom(mimeType);

		switch (type) {
			case 'video':
				return new VideoFile(nodePath, stats, mimeType);
		}

		return new File(nodePath, stats, mimeType);
	}

	static createFromSerialized(serialized: Serialized): File {
		switch (serialized.instance) {
			case 'File': {
				const data = <SerializedFileData> serialized.data;
				return new File(data.path, data.stats, data.mimeType);
			}

			case 'VideoFile': {
				const data = <SerializedMediaFileData> serialized.data;
				const metadata = MediainfoMetadataFactory.createFromSerialized(data.metadata);
				return new VideoFile(data.path, data.stats, data.mimeType, metadata);
			}
		}
	}
}
