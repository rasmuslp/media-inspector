import cli from 'cli-ux';

import { FsTreeFactory } from '../../fs-tree';
import { MetadataCache, MetadataCacheSchema } from '../../metadata/MetadataCache';
import { MediainfoMetadata } from '../../metadata/mediainfo/MediainfoMetadata';
import { MediainfoMetadataFactory } from '../../metadata/mediainfo/MediainfoMetadataFactory';
import { SerializableIO } from '../../serializable/SerializableIO';

export async function readMetadataFromSerialized(path: string, verbose = false): Promise<MetadataCache> {
	if (verbose) {
		cli.action.start(`Reading from json ${path}`);
	}

	const serialized = await SerializableIO.read(path);
	if (serialized.type !== 'MetadataCache') {
		throw new Error(`readMetadataFromSerialized cannot read ${serialized.type}`);
	}
	const parsed = MetadataCacheSchema.parse(serialized.data);
	const fsTree = FsTreeFactory.getTreeFromSerialized(parsed.tree);
	const videoMetadata = new Map<string, MediainfoMetadata>();

	for (const [path, data] of Object.entries(parsed.metadata)) {
		const metadata = MediainfoMetadataFactory.getFromSerialized(data);
		videoMetadata.set(path, metadata);
	}

	const metadataCache = new MetadataCache(fsTree, videoMetadata);

	if (verbose) {
		cli.action.stop();
	}

	return metadataCache;
}
