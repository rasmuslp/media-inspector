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
		this._mimeType = mimeType;
	}

	get mimeType(): string {
		return this._mimeType;
	}

	get type(): string {
		return File.getTypeFrom(this._mimeType);
	}

	static getTypeFrom(mimeType: string): string {
		const match = File._typeExtractor.exec(mimeType);
		if (match) {
			const type = match[1];

			return type;
		}

		return 'unknown';
	}

	getDataForSerialization(): T {
		const data = Object.assign(super.getDataForSerialization(), {
			mimeType: this._mimeType
		});

		return data;
	}
}
