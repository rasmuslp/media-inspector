import { z } from 'zod';

import { FsNode, FsNodeSchema, FsNodeStats } from './FsNode';

export const DirectorySchema = FsNodeSchema.extend({
	children: z.array(FsNodeSchema)
});
type DirectoryData = z.infer<typeof DirectorySchema>;

export class Directory extends FsNode<DirectoryData> {
	_children: FsNode[];

	constructor(nodePath: string, stats: FsNodeStats, children: FsNode[] = []) {
		super(nodePath, stats);
		this._children = children;
	}

	get children(): FsNode[] {
		return this._children;
	}

	getDataForSerialization(): Record<string, unknown> {
		return {
			children: this._children.map(node => node.serialize())
		};
	}
}
