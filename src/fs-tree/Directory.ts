import { z } from 'zod';

import { FsNode, FsNodeSchema, FsNodeSerialized } from './FsNode';

export const DirectorySchema = FsNodeSchema;
type DirectorySerialized = z.infer<typeof DirectorySchema>;

export class Directory extends FsNode<DirectorySerialized> {
	getDataForSerialization(): FsNodeSerialized {
		return {
			path: this.path,
			stats: this.stats
		};
	}
}
