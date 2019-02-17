import * as t from 'io-ts';

import { FsNode, FsNodeDataValidator } from './FsNode';
import { FsNodeType } from './FsNodeType';

const FileDataPartial = t.partial({
	mimeType: t.string
});

export const FileDataValidator = t.intersection([FsNodeDataValidator, FileDataPartial]);

export type FileData = t.TypeOf<typeof FileDataValidator>;

export class File extends FsNode {
	static _typeExtractor = /^([^/]+)/;
	_mimeType: string;

	constructor(nodePath, stats, mimeType: string) {
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
		const match = mimeType.match(File._typeExtractor);
		if (match) {
			const type = match[1];

			return type;
		}
	}

	serializeData(): object {
		const data = Object.assign(super.serializeData(), {
			mimeType: this._mimeType
		});

		return data;
	}
}
