import * as t from 'io-ts';

import { FsNode, TFsNode } from '../../fs-tree';
import { Serializable, TSerializable } from '../../serializable/Serializable';
import { MediainfoMetadata, TMediainfoMetadata } from '../../metadata/mediainfo/MediainfoMetadata';

const TMetadataCachePartial = t.type({
	rootNode: TFsNode,
	metadata: t.record(t.string, TMediainfoMetadata)
});

export const TMetadataCache = t.intersection([TSerializable, TMetadataCachePartial]);
export type MetadataCacheData = t.TypeOf<typeof TMetadataCache>;

export class MetadataCache extends Serializable<MetadataCacheData> {
	public readonly rootNode: FsNode;
	public readonly metadata: Map<string, MediainfoMetadata>;

	constructor(rootNode: FsNode, metadata: Map<string, MediainfoMetadata>) {
		super();
		this.rootNode = rootNode;
		this.metadata = metadata;
	}

	getDataForSerialization(): Partial<MetadataCacheData> {
		const serializedMetadata = {};
		this.metadata.forEach((metadata, path) => {
			serializedMetadata[path] = metadata.serialize();
		});

		return {
			rootNode: this.rootNode.serialize(),
			metadata: serializedMetadata
		};
	}
}
