import { z } from 'zod';

import { Serializable, SerializableSchema } from '../serializable/Serializable';

const FsNodeStatsSchema = z.object({
	size: z.number()
});
export type FsNodeStats = z.infer<typeof FsNodeStatsSchema>;

export const FsNodeSchema = SerializableSchema.extend({
	path: z.string(),
	stats: FsNodeStatsSchema
});
export type FsNodeData = z.infer<typeof FsNodeSchema>;

export abstract class FsNode<T extends FsNodeData = FsNodeData> extends Serializable<T> {
	constructor(nodePath: string, stats: FsNodeStats) {
		super();
		this.data.path = nodePath;
		this.data.stats = {
			size: stats?.size ?? 0
		};
	}

	get path(): string {
		return this.data.path;
	}

	get size(): number {
		return this.data.stats.size;
	}
}
