import * as t from 'io-ts';

import { FsTree, TFsTree } from '../fs-tree';
import { Serializable, TSerializable } from '../serializable/Serializable';
import { MediainfoMetadata, TMediainfoMetadata } from './mediainfo/MediainfoMetadata';
import { Metadata } from './Metadata';

const TMetadataCachePartial = t.type({
	tree: TFsTree,
	metadata: t.record(t.string, TMediainfoMetadata)
});

export const TMetadataCache = t.intersection([TSerializable, TMetadataCachePartial]);
export type MetadataCacheData = t.TypeOf<typeof TMetadataCache>;

export class MetadataCache extends Serializable<MetadataCacheData> {
	public readonly tree: FsTree;
	private readonly metadata: Map<string, MediainfoMetadata>;

	constructor(tree: FsTree, metadata: Map<string, MediainfoMetadata>) {
		super();
		this.tree = tree;
		this.metadata = metadata;
	}

	getDataForSerialization(): Partial<MetadataCacheData> {
		const serializedMetadata: Record<string, any> = {};
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
