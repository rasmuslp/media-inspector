import mime from 'mime-types';

import {File} from './File';
import {VideoFile} from './VideoFile';

export class FileFactory {
	static async createFileFrom(nodePath: string, stats): Promise<File> {
		const mimeType = mime.lookup(nodePath) || 'application/octet-stream';
		const type = File.getTypeFrom(mimeType);

		switch (type) {
			case 'video':
				return new VideoFile(nodePath, stats, mimeType);
		}

		return new File(nodePath, stats, mimeType);
	}
}
