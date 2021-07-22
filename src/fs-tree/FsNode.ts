import { z } from 'zod';

import { Serializable } from '../serializable/Serializable';

const FsNodeStatsSchema = z.object({
	size: z.number()
});
export type FsNodeStats = z.infer<typeof FsNodeStatsSchema>;

export const FsNodeSchema = z.object({
	path: z.string(),
	stats: FsNodeStatsSchema
});
export type FsNodeSerialized = z.infer<typeof FsNodeSchema>;

export abstract class FsNode<T extends FsNodeSerialized = FsNodeSerialized> extends Serializable<T> {
	public readonly path: string;

	protected readonly stats: FsNodeStats;

	constructor(nodePath: string, stats: FsNodeStats) {
		super();
		this.path = nodePath;
		this.stats = {
			size: stats?.size ?? 0
		};
	}

	get size(): number {
		return this.stats.size;
	}
}
