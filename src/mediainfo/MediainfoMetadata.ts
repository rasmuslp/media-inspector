export class MediainfoMetadata {
	_mediainfo: any;

	constructor(mediainfo) {
		this._mediainfo = mediainfo;
	}

	_getTrack(trackType) {
		for (const track of this._mediainfo.media.track) {
			if (trackType.toLocaleLowerCase() === track._type.toLocaleLowerCase()) {
				return track;
			}
		}

		throw new Error(`Track type '${trackType}' not found`);
	}

	static _getOrDie(track, property, errorMessage) {
		// See if the property is there
		const value = track[property];
		if (value != null) {
			return value;
		}

		// Or die
		throw new Error(errorMessage);
	}

	get(trackType, property) {
		const track = this._getTrack(trackType);

		switch (trackType) {
			// container
			case 'general': {
				switch (property) {
					case 'bitrate':
						return track.overallbitrate;

					default:
						return MediainfoMetadata._getOrDie(track, property, `[get] could not find '${property}' in '${trackType}'`);
				}
			}

			default:
				return MediainfoMetadata._getOrDie(track, property, `[get] could not find '${property}' in '${trackType}'`);
		}
	}
}
