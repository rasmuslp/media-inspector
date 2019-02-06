import {FsNode, FsNodeType} from './FsNode';
import { Serialized } from './Serialized';

export class File extends FsNode {
	_mimeType: string;
	static _typeExtractor = /^([^/]+)/;

	constructor(nodePath, stats, mimeType: string) {
		super(nodePath, stats);
		this._fsNodeType = FsNodeType.FILE;
		this._mimeType = mimeType;
	}

	get type() {
		return File.getTypeFrom(this._mimeType);
	}

	static getTypeFrom(mimeType: string): string {
		const match = mimeType.match(File._typeExtractor);
		if (match) {
			const type = match[1];

			return type;
		}
	}

	serializeData() {
		const superData = super.serializeData();
		return Object.assign(superData, {
			mimeType: this._mimeType
		});
	}

	deserialize(obj: Serialized) {}
}
