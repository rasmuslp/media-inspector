import { Metadata } from './Metadata';

export class MediainfoMetadata extends Metadata {
	_getTrack(trackType: string): any {
		for (const track of this.data.metadata.media.track) {
			if (trackType.toLocaleLowerCase() === track._type.toLocaleLowerCase()) {
				return track;
			}
		}

		throw new Error(`Track type '${trackType}' not found`);
	}

	get(path: string): string {
		const [trackType, propertyName] = path.split('.');
		const property = this._getProperty(trackType, propertyName);

		return property;
	}

	_getProperty(trackType: string, property: string): string {
		const track = this._getTrack(trackType);

		// eslint-disable-next-line default-case
		switch (trackType) {
			case 'general': {
				// eslint-disable-next-line default-case
				switch (property) {
					case 'bitrate':
						return (track as {overallbitrate: string}).overallbitrate;
				}
			}
		}

		// See if the property is there
		if (property in track) {
			return track[property] as string;
		}

		throw new Error(`[get] could not find '${property}' in '${trackType}'`);
	}
}
