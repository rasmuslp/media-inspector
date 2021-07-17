import * as t from 'io-ts';

import { Serializable, TSerializable } from '../serializable/Serializable';

export const TFsNodeStats = t.type({
	size: t.number
});
export type FsNodeStats = t.TypeOf<typeof TFsNodeStats>;

export const TFsNodePartial = t.type({
	path: t.string,
	stats: TFsNodeStats
});

export const TFsNode = t.intersection([TSerializable, TFsNodePartial]);
export type FsNodeData = t.TypeOf<typeof TFsNode>;

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
