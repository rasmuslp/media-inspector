import { z } from 'zod';

import { FsTree } from '../fs-tree';
import { Serializable, SerializableSchema } from '../serializable/Serializable';
import { MediainfoMetadata } from './mediainfo/MediainfoMetadata';
import { Metadata } from './Metadata';
import { IMetadataGetter } from './IMetadataGetter';

export const MetadataCacheSchema = z.object({
	tree: SerializableSchema,
	metadata: z.record(SerializableSchema)
});
type MetadataCacheSerialized = z.infer<typeof MetadataCacheSchema>;

export class MetadataCache extends Serializable<MetadataCacheSerialized> implements IMetadataGetter {
	public readonly tree: FsTree;

	private readonly metadata: Map<string, MediainfoMetadata>;

	constructor(tree: FsTree, metadata: Map<string, MediainfoMetadata>) {
		super();
		this.tree = tree;
		this.metadata = metadata;
	}

	getDataForSerialization(): MetadataCacheSerialized {
		const serializedMetadata: MetadataCacheSerialized = {};
		for (const [path, metadata] of this.metadata.entries()) {
			serializedMetadata[path] = metadata.serialize();
		}

		return {
			tree: this.tree.serialize(),
			metadata: serializedMetadata
		};
	}

	getMetadata(path: string): Metadata | undefined {
		return this.metadata.get(path);
	}
}
