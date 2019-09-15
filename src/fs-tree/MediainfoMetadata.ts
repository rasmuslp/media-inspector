import { Metadata } from './Metadata';

export class MediainfoMetadata extends Metadata {
	_getTrack(trackType): object {
		for (const track of this._metadata.media.track) {
			if (trackType.toLocaleLowerCase() === track._type.toLocaleLowerCase()) {
				return track;
			}
		}

		throw new Error(`Track type '${trackType}' not found`);
	}

	static _getOrDie(track, property, errorMessage): string {
		// See if the property is there
		if (property in track) {
			return track[property];
		}

		// Or die
		throw new Error(errorMessage);
	}

	get(path): string {
		const [trackType, property] = path.split('.');
		const track = this._getTrack(trackType);

		switch (trackType) {
			// container
			case 'general': {
				switch (property) {
					case 'bitrate':
						return (track as {overallbitrate: string}).overallbitrate;

					default:
						return MediainfoMetadata._getOrDie(track, property, `[get] could not find '${property}' in '${trackType}'`);
				}
			}

			default:
				return MediainfoMetadata._getOrDie(track, property, `[get] could not find '${property}' in '${trackType}'`);
		}
	}
}
