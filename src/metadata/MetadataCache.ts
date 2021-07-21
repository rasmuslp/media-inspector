import { z } from 'zod';

import { FsTree, FsTreeSchema } from '../fs-tree';
import { Serializable, SerializableSchema } from '../serializable/Serializable';
import { MediainfoMetadata, MiMetadataSchema } from './mediainfo/MediainfoMetadata';
import { Metadata } from './Metadata';

export const MetadataCacheSchema = SerializableSchema.extend({
	tree: FsTreeSchema,
	metadata: z.record(MiMetadataSchema)
});
type MetadataCacheData = z.infer<typeof MetadataCacheSchema>;

export class MetadataCache extends Serializable<MetadataCacheData> {
	public readonly tree: FsTree;
	private readonly metadata: Map<string, MediainfoMetadata>;

	constructor(tree: FsTree, metadata: Map<string, MediainfoMetadata>) {
		super();
		this.tree = tree;
		this.metadata = metadata;
	}

	getDataForSerialization(): Record<string, unknown> {
		const serializedMetadata: Record<string, unknown> = {};
		this.metadata.forEach((metadata, path) => {
			serializedMetadata[path] = metadata.serialize();
		});

		return {
			tree: this.tree.serialize(),
			metadata: serializedMetadata
		};
	}

	getMetadata(path: string): Metadata|undefined {
		return this.metadata.get(path);
	}
}
