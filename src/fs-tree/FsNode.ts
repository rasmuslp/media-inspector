import * as t from 'io-ts';

import { Serializable, SerializableDataValidator } from './Serializable';

export const FsNodeStatsPartial = t.type({
	size: t.number
});

export const FsNodeDataPartial = t.type({
	path: t.string,
	stats: FsNodeStatsPartial
});

export const FsNodeDataValidator = t.intersection([SerializableDataValidator, FsNodeDataPartial]);

export type FsNodeStats = t.TypeOf<typeof FsNodeStatsPartial>;
export type FsNodeData = t.TypeOf<typeof FsNodeDataValidator>;

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

	abstract isDirectory(): boolean;

	abstract isFile(): boolean;
}
