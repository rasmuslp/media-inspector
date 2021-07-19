import cli from 'cli-ux';

import { FsTreeFactory } from '../../fs-tree';
import { MetadataCache, MetadataCacheData } from '../../metadata/MetadataCache';
import { MediainfoMetadata } from '../../metadata/mediainfo/MediainfoMetadata';
import { MediainfoMetadataFactory } from '../../metadata/mediainfo/MediainfoMetadataFactory';
import { SerializableIO } from '../../serializable/SerializableIO';

export async function readMetadataFromSerialized(path: string, verbose = false): Promise<MetadataCache> {
	if (verbose) {
		cli.action.start(`Reading from json ${path}`);
	}

	const parsed = await SerializableIO.read(path);
	const parsedData = parsed.data as MetadataCacheData;
	const fsTree = FsTreeFactory.getTreeFromSerialized(parsedData.tree);
	const videoMetadata = new Map<string, MediainfoMetadata>();

	for (const [path, data] of Object.entries(parsedData.metadata)) {
		const metadata = MediainfoMetadataFactory.getFromSerialized(data);
		videoMetadata.set(path, metadata);
	}

	const metadataCache = new MetadataCache(fsTree, videoMetadata);

	if (verbose) {
		cli.action.stop();
	}

	return metadataCache;
}
