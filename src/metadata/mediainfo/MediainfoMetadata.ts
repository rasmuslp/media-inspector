import * as t from 'io-ts';

import { Serializable, TSerializable } from '../../serializable/Serializable';
import { Metadata } from '../Metadata';

export const TMiTrack = t.type({
	_type: t.string
});

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
		if (track[property]) {
			return track[property] as string;
		}

		throw new Error(`[get] could not find '${property}' in '${trackType}'`);
	}

	_getTrack(trackType: string): unknown {
		for (const track of this.data.metadata.media.track) {
			if (trackType.toLocaleLowerCase() === track._type.toLocaleLowerCase()) {
				return track;
			}
		}

		throw new Error(`Track type '${trackType}' not found`);
	}
}
