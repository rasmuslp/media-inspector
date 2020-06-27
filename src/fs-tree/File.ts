import * as t from 'io-ts';

import { FsNode, FsNodeDataValidator } from './FsNode';
import { FsNodeType } from './FsNodeType';

const FileDataPartial = t.partial({
	mimeType: t.string
});

export const FileDataValidator = t.intersection([FsNodeDataValidator, FileDataPartial]);

export type FileData = t.TypeOf<typeof FileDataValidator>;

export class File<T extends FileData = FileData> extends FsNode<T> {
	static _typeExtractor = RegExp(/^([^/]+)/);
	_mimeType: string;

	constructor(nodePath: string, stats, mimeType: string) {
		super(nodePath, stats);
		this._fsNodeType = FsNodeType.FILE;
		this.data.mimeType = mimeType;
	}

	get mimeType(): string {
		return this.data.mimeType;
	}

	get type(): string {
		return File.getTypeFrom(this.data.mimeType);
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
