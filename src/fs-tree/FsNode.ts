import * as t from 'io-ts';

import { Serializable, SerializableDataValidator } from './Serializable';
import { FsNodeType } from './FsNodeType';

export const FsNodeStatsPartial = t.partial({
	size: t.number
});

export const FsNodeDataPartial = t.partial({
	path: t.string,
	stats: FsNodeStatsPartial
});

export const FsNodeDataValidator = t.intersection([SerializableDataValidator, FsNodeDataPartial]);

export type FsNodeStats = t.TypeOf<typeof FsNodeStatsPartial>;
export type FsNodeData = t.TypeOf<typeof FsNodeDataValidator>;

export abstract class FsNode<T extends FsNodeData = FsNodeData> extends Serializable<T> {
	_fsNodeType: FsNodeType;
	constructor(nodePath: string, stats: FsNodeStats) {
		super();
		this.data.path = nodePath;
		this.data.stats = {
			size: stats?.size ?? 0
		};
		this._fsNodeType = FsNodeType.UNKNOWN;
	}

	get path(): string {
		return this.data.path;
	}

	get size(): number {
		return this.data.stats.size;
	}

	isDirectory(): boolean {
		return this._fsNodeType === FsNodeType.DIRECTORY;
	}

	isFile(): boolean {
		return this._fsNodeType === FsNodeType.FILE;
	}

}
