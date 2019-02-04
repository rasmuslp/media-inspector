import mime from 'mime-types';

import {File} from './File';
import {MediainfoMetadataFactory} from './MediainfoMetadataFactory';
import {VideoFile} from './VideoFile';

export class FileFactory {
	static async createFileFrom(nodePath: string, stats): Promise<File> {
		const mimeType = mime.lookup(nodePath) || 'application/octet-stream';
		const type = File.getTypeFrom(mimeType);

		switch (type) {
			case 'video':
				const metadata = await MediainfoMetadataFactory.getFromFile(nodePath);
				return new VideoFile(nodePath, stats, mimeType, metadata);
		}

		return new File(nodePath, stats, mimeType);
	}
}
