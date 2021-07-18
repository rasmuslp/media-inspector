import mime from 'mime-types';

import { SerializableData } from '../serializable/Serializable';
import { File, FileData } from './File';
import { FsNodeStats } from './FsNode';

export class FileFactory {
	static getFromFileSystem(nodePath: string, stats: FsNodeStats): File {
		const mimeType = mime.lookup(nodePath) || 'application/octet-stream';

		return new File(nodePath, stats, mimeType);
	}

	static getFromSerialized(serialized: SerializableData): File {
		const data = serialized as FileData;
		return new File(data.path, data.stats, data.mimeType);
	}
}
