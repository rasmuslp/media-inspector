import * as t from 'io-ts';

import { FsNode, FsNodeStats, TFsNode } from './FsNode';

const TFilePartial = t.type({
	mimeType: t.string
});

export const TFile = t.intersection([TFsNode, TFilePartial]);
export type FileData = t.TypeOf<typeof TFile>;

export class File<T extends FileData = FileData> extends FsNode<T> {
	constructor(nodePath: string, stats: FsNodeStats, mimeType: string) {
		super(nodePath, stats);
		this.data.mimeType = mimeType;
	}

	get mimeType(): string {
		return this.data.mimeType;
	}
}
