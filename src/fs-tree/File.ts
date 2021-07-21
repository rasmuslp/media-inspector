import { z } from 'zod';

import { FsNode, FsNodeSchema, FsNodeStats } from './FsNode';

export const FileSchema = FsNodeSchema.extend({
	mimeType: z.string()
});
type FileData = z.infer<typeof FileSchema>;

export class File extends FsNode<FileData> {
	constructor(nodePath: string, stats: FsNodeStats, mimeType: string) {
		super(nodePath, stats);
		this.data.mimeType = mimeType;
	}

	get mimeType(): string {
		return this.data.mimeType;
	}
}
