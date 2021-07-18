import cli from 'cli-ux';

import { DirectoryFactory } from '../../fs-tree';
import { Metadata } from '../../metadata/Metadata';
import { MediainfoMetadataFactory } from '../../metadata/mediainfo/MediainfoMetadataFactory';
import { Serializable } from '../../serializable/Serializable';
import { MetadataCache, MetadataCacheData } from './MetadataCache';

export async function readMetadataFromSerialized(path: string, verbose = false): Promise<MetadataCache> {
	if (verbose) {
		cli.action.start(`Reading from json ${path}`);
	}

	const parsed = await Serializable.read(path);
	const parsedData = parsed.data as MetadataCacheData;
	const rootNode = DirectoryFactory.getTreeFromSerialized(parsedData.rootNode);
	const videoMetadata = new Map<string, Metadata>();

	for (const [path, data] of Object.entries(parsedData.metadata)) {
		const metadata = MediainfoMetadataFactory.getFromSerialized(data);
		videoMetadata.set(path, metadata);
	}

	const metadataCache = new MetadataCache(rootNode, videoMetadata);

	if (verbose) {
		cli.action.stop();
	}

	return metadataCache;
}
