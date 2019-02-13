import { SerializedFsNodeData, FsNode, FsNodeType } from './FsNode';
import { Serialized } from './Serialized';

export interface SerializedFileData extends SerializedFsNodeData {
	mimeType: string;
}

export class File extends FsNode {
	static _typeExtractor = /^([^/]+)/;
	_mimeType: string;

	constructor(nodePath, stats, mimeType: string) {
		super(nodePath, stats);
		this._fsNodeType = FsNodeType.FILE;
		this._mimeType = mimeType;
	}

	get mimeType() {
		return this._mimeType;
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

	serialize(): Serialized<SerializedFileData> {
		return {
			instance: this.constructor.name,
			data: this.serializeData()
		};
	}

	serializeData(): SerializedFileData {
		return Object.assign({}, super.serializeData(), {
			mimeType: this._mimeType
		});
	}
}
