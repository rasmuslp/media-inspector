import { z } from 'zod';

import { FsNode, FsNodeSchema } from '../fs-tree';
import { Serializable, SerializableSchema } from '../serializable/Serializable';
import { MediainfoMetadata, MiMetadataSchema } from './mediainfo/MediainfoMetadata';
import { Metadata } from './Metadata';

export const MetadataCacheSchema = SerializableSchema.extend({
	rootNode: FsNodeSchema,
	metadata: z.record(MiMetadataSchema)
});
export type MetadataCacheData = z.infer<typeof MetadataCacheSchema>;

export class MetadataCache extends Serializable<MetadataCacheData> {
	public readonly rootNode: FsNode;
	private readonly metadata: Map<string, MediainfoMetadata>;

	constructor(rootNode: FsNode, metadata: Map<string, MediainfoMetadata>) {
		super();
		this.rootNode = rootNode;
		this.metadata = metadata;
	}

	getDataForSerialization(): Record<string, unknown> {
		const serializedMetadata: Record<string, unknown> = {};
		this.metadata.forEach((metadata, path) => {
			serializedMetadata[path] = metadata.serialize();
		});

		return {
			rootNode: this.rootNode.serialize(),
			metadata: serializedMetadata
		};
	}

	getMetadata(path: string): Metadata|undefined {
		return this.metadata.get(path);
	}
}
