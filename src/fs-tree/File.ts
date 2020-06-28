import * as t from 'io-ts';

import { FsNode, FsNodeStats, TFsNode } from './FsNode';

const TFilePartial = t.type({
	mimeType: t.string
});

export const TFile = t.intersection([TFsNode, TFilePartial]);
export type FileData = t.TypeOf<typeof TFile>;

export class File<T extends FileData = FileData> extends FsNode<T> {
	static _typeExtractor = new RegExp(/^([^/]+)/);

	constructor(nodePath: string, stats: FsNodeStats, mimeType: string) {
		super(nodePath, stats);
		this.data.mimeType = mimeType;
	}

	get mimeType(): string {
		return this.data.mimeType;
	}

	get type(): string {
		return File.getTypeFrom(this.data.mimeType);
	}

	isDirectory(): boolean {
		return false;
	}

	isFile(): boolean {
		return true;
	}

	static getTypeFrom(mimeType: string): string {
		const match = File._typeExtractor.exec(mimeType);
		if (match) {
			const type = match[1];

			return type;
		}

		return 'unknown';
	}
}
