import { z } from 'zod';

import { FsNode, FsNodeSchema, FsNodeStats } from './FsNode';

export const FileSchema = FsNodeSchema.extend({
	mimeType: z.string()
});
type FileSerialized = z.infer<typeof FileSchema>;

export class File extends FsNode<FileSerialized> {
	readonly mimeType: string;

	constructor(nodePath: string, stats: FsNodeStats, mimeType: string) {
		super(nodePath, stats);
		this.mimeType = mimeType;
	}

	getDataForSerialization(): FileSerialized {
		return {
			path: this.path,
			stats: this.stats,
			mimeType: this.mimeType
		};
	}

	getMimeTypeWithoutSubtype() {
		return this.mimeType.split('/', 1)[0];
	}
}
