import mime from 'mime-types';

import { File, FileData } from './File';
import { VideoFile } from './VideoFile';
import { MediainfoMetadataFactory } from '../metadata/mediainfo/MediainfoMetadataFactory';
import { MediaFileData } from './MediaFile';
import { SerializableData } from '../serializable/Serializable';
import { FsNodeStats } from './FsNode';

export class FileFactory {
	static getFromFileSystem(nodePath: string, stats: FsNodeStats): File {
		const mimeType = mime.lookup(nodePath) || 'application/octet-stream';
		const type = File.getTypeFrom(mimeType);

		switch (type) {
			case 'video':
				return new VideoFile(nodePath, stats, mimeType);

			default:
				return new File(nodePath, stats, mimeType);
		}
	}

	static getFromSerialized(serialized: SerializableData): File {
		switch (serialized.type) {
			case 'VideoFile': {
				const data = serialized as MediaFileData;
				const metadata = MediainfoMetadataFactory.getFromSerialized(data.metadata);
				return new VideoFile(data.path, data.stats, data.mimeType, metadata);
			}

			case 'File':
			default: {
				const data = serialized as FileData;
				return new File(data.path, data.stats, data.mimeType);
			}
		}
	}
}
