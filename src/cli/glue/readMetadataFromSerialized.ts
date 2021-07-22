import cli from 'cli-ux';

import { MetadataCache } from '../../metadata/MetadataCache';
import { MetadataCacheFactory } from '../../metadata/MetadataCacheFactory';
import { SerializableIO } from '../../serializable/SerializableIO';

export async function readMetadataFromSerialized(path: string, verbose = false): Promise<MetadataCache> {
	if (verbose) {
		cli.action.start(`Reading from json ${path}`);
	}

	const serialized = await SerializableIO.read(path);
	const metadataCache = MetadataCacheFactory.getFromSerialized(serialized);

	if (verbose) {
		cli.action.stop();
	}

	return metadataCache;
}
