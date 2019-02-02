import { FsObject} from '../fs-tree/FsObject';

export abstract class Purge {
	_message: string;
	fsObject: FsObject; // TODO

	constructor(message, fsObject) {
		this._message = message;
		this.fsObject = fsObject;
	}

	get score() {
		return 0;
	}

	abstract getPurgeReason(): string
}
