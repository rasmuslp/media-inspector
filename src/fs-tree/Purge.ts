import { FsObject} from './FsObject';

export class Purge {
	_message: string;
	fsObject: FsObject; // TODO

	constructor(message, fsObject) {
		this._message = message;
		this.fsObject = fsObject;
	}

	get score() {
		return 0;
	}

	// NB: Override this!
	getPurgeReason() {
		return `[UNKNOWN] ${this._message}`;
	}
}
