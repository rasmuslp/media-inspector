export abstract class Metadata {
	_metadata: any;

	constructor(metadata) {
		this._metadata = metadata;
	}

	abstract get(path: string);
}
