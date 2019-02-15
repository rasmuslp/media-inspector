import { FsNode } from '../fs-tree/FsNode';

export abstract class Match {
	_message: string;
	_fsNode: FsNode;

	constructor(message, fsNode) {
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
