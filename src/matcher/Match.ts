import { FsNode } from '../fs-tree';

export type MatchReasonOptions = {
	colorized: boolean
}

export abstract class Match {
	readonly message: string;
	readonly fsNode: FsNode;

	constructor(message: string, fsNode: FsNode) {
		this.message = message;
		this.fsNode = fsNode;
	}

	get score(): number {
		return 0;
	}

	abstract getMatchReason(options: MatchReasonOptions): string
}
