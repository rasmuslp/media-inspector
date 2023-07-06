import { ux } from '@oclif/core';

import { MetadataCache } from '../../metadata/MetadataCache';
import { MetadataCacheFactory } from '../../metadata/MetadataCacheFactory';
import { SerializableIO } from '../../serializable/SerializableIO';

export async function readMetadataFromSerialized(path: string, verbose = false): Promise<MetadataCache> {
	if (verbose) {
		ux.action.start(`Reading from json ${path}`);
	}

	const serialized = await SerializableIO.read(path);
	const metadataCache = MetadataCacheFactory.getFromSerialized(serialized);

	if (verbose) {
		ux.action.stop();
	}

	return metadataCache;
}
