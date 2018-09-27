class MediainfoMetadata {
	constructor(mediainfo) {
		this._mediainfo = mediainfo;
	}

	_getTrack(trackType) {
		try {
			for (const track of this._mediainfo.media.track) {
				if (trackType.toLocaleLowerCase() === track._type.toLocaleLowerCase()) {
					return track;
				}
			}
		}
		catch (e) {
			throw new Error(`Track type '${trackType}' not found`, e);
		}

		throw new Error(`Track type '${trackType}' not found`);
	}

	_getProperty(track, property) {
		const value = track[property];

		// Try parsing to Number
		const num = Number(value);
		if (!isNaN(num)) {
			return num;
		}

		return value;
	}

	_getOrDie(track, property, errorMessage) {
		// See if the property is there
		const value = this._getProperty(track, property);
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
						return this._getProperty(track, 'overallbitrate');

					default:
						return this._getOrDie(track, property, `[get] could not find '${property}' in '${trackType}'`);
				}
			}

			default:
				return this._getOrDie(track, property, `[get] could not find '${property}' in '${trackType}'`);
		}
	}
}

module.exports = MediainfoMetadata;
