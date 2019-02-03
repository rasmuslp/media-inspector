import { FsObject} from '../fs-tree/FsObject';

export abstract class Purge {
	_message: string;
	_fsObject: FsObject;

	constructor(message, fsObject) {
		this._message = message;
		this._fsObject = fsObject;
	}

	get fsObject() {
		return this._fsObject;
	}

	get score() {
		return 0;
	}

	abstract getPurgeReason(): string
}
