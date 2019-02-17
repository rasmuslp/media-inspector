import * as t from 'io-ts';

import { Serializable, SerializableDataValidator } from './Serializable';
import { FsNodeType } from './FsNodeType';

export const FsNodeDataPartial = t.partial({
	path: t.string,
	stats: t.unknown // TODO: Better
});

export const FsNodeDataValidator = t.intersection([SerializableDataValidator, FsNodeDataPartial]);

export type FsNodeData = t.TypeOf<typeof FsNodeDataValidator>;

export abstract class FsNode extends Serializable {
	_fsNodeType: FsNodeType;
	_path: string;
	_stats;

	constructor(nodePath: string, stats) {
		super();
		this._fsNodeType = FsNodeType.UNKNOWN;
		this._path = nodePath;
		this._stats = {
			size: stats.size || 0
		};
	}

	get path(): string {
		return this._path;
	}

	get size(): number {
		return this._stats.size;
	}

	isDirectory(): boolean {
		return this._fsNodeType === FsNodeType.DIRECTORY;
	}

	isFile(): boolean {
		return this._fsNodeType === FsNodeType.FILE;
	}

	serializeData(): object {
		return {
			path: this._path,
			stats: this._stats
		};
	}
}
