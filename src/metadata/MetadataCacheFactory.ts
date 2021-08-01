import { SerializableSerialized } from '../serializable/Serializable';
import { MediainfoMetadata } from './mediainfo/MediainfoMetadata';
import { MetadataCache, MetadataCacheSchema } from './MetadataCache';
import { FsTreeFactory } from '../fs-tree';
import { MediainfoMetadataFactory } from './mediainfo/MediainfoMetadataFactory';

export class MetadataCacheFactory {
	static getFromSerialized(serialized: SerializableSerialized): MetadataCache {
		if (serialized.type !== 'MetadataCache') {
			throw new Error(`MetadataCacheFactory cannot determine what this is: ${serialized.type}`);
		}

		const parsed = MetadataCacheSchema.parse(serialized.data);

		const fsTree = FsTreeFactory.getTreeFromSerialized(parsed.tree);
		const videoMetadata = new Map<string, MediainfoMetadata>();
		for (const [path, data] of Object.entries(parsed.metadata)) {
			const metadata = MediainfoMetadataFactory.getFromSerialized(data);
			videoMetadata.set(path, metadata);
		}

		const metadataCache = new MetadataCache(fsTree, videoMetadata);
		return metadataCache;
	}
}
