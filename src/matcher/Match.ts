import { FsNode } from '../fs-tree';

export abstract class Match {
	_message: string;
	_fsNode: FsNode;

	constructor(message: string, fsNode: FsNode) {
		this._message = message;
		this._fsNode = fsNode;
	}

	get fsNode(): FsNode {
		return this._fsNode;
	}

	get score(): number {
		return 0;
	}

	abstract getMatchReason(): string
}
