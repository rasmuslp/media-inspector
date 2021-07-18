import * as t from 'io-ts';

import { Serializable, TSerializable } from '../../serializable/Serializable';
import { Metadata } from '../Metadata';

export const TMiTrack = t.intersection([
	t.type({
		_type: t.string
	}),
	t.record(t.string, t.string)
]);

export type MiTrack = t.TypeOf<typeof TMiTrack>;

export const TMiMetadataRaw = t.type({
	media: t.record(t.string, t.array(TMiTrack))
});
export type MiMetadataRaw = t.TypeOf<typeof TMiMetadataRaw>;

export const TMiMetadataPartial = t.type({
	metadata: TMiMetadataRaw
});

export const TMediainfoMetadata = t.intersection([TSerializable, TMiMetadataPartial]);
export type MediainfoMetadataData = t.TypeOf<typeof TMediainfoMetadata>;

export class MediainfoMetadata extends Serializable<MediainfoMetadataData> implements Metadata {
	constructor(metadata: MiMetadataRaw) {
		super();
		this.data.metadata = metadata;
	}

	get(path: string): string {
		const [trackType, propertyName] = path.split('.');
		const property = this.getProperty(trackType, propertyName);

		return property;
	}

	getProperty(trackType: string, property: string): string {
		const track = this.getTrack(trackType);

		// eslint-disable-next-line default-case
		switch (trackType) {
			case 'general': {
				// eslint-disable-next-line default-case
				switch (property) {
					case 'bitrate':
						return track.overallbitrate;
				}
			}
		}

		// See if the property is there
		if (track[property]) {
			return track[property];
		}

		throw new Error(`[get] could not find '${property}' in '${trackType}'`);
	}

	getTrack(trackType: string): MiTrack {
		for (const track of this.data.metadata.media.track) {
			if (trackType.toLocaleLowerCase() === track._type.toLocaleLowerCase()) {
				return track;
			}
		}

		throw new Error(`Track type '${trackType}' not found`);
	}
}
