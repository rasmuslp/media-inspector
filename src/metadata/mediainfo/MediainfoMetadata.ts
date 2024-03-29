import { z } from 'zod';

import { Metadata } from '../Metadata';
import { Serializable } from '../../serializable/Serializable';
import { stringToStringOrNumber } from '../../utils/stringToStringOrNumber';

const MediainfoTrackKnownSchema = z.object({
	_type: z.string()
});
const MediainfoTrackUnknownSchema = z.record(z.union([z.string(), z.record(z.string())]));
const MediainfoTrackSchema = MediainfoTrackKnownSchema.and(MediainfoTrackUnknownSchema);
type MediainfoTrack = z.infer<typeof MediainfoTrackSchema>;

export const MediainfoMetadataRawSchema = z.object({
	media: z.object({
		track: z.array(MediainfoTrackSchema)
	})
});

export type MediainfoMetadataRaw = z.infer<typeof MediainfoMetadataRawSchema>;

export const MediainfoMetadataSchema = z.object({
	metadata: MediainfoMetadataRawSchema
});

export type MediainfoMetadataSerialized = z.infer<typeof MediainfoMetadataSchema>;

export class MediainfoMetadata extends Serializable<MediainfoMetadataSerialized> implements Metadata {
	readonly metadata: MediainfoMetadataRaw;

	constructor(metadata: MediainfoMetadataRaw) {
		super();
		this.metadata = metadata;
	}

	get(path: string): number | string {
		const [trackType, propertyName] = path.split('.');
		const property = this.getProperty(trackType, propertyName);
		const convertedPropertyValue = stringToStringOrNumber(property);

		return convertedPropertyValue;
	}

	getProperty(trackType: string, property: string): string {
		const track = this.getTrack(trackType);

		// eslint-disable-next-line default-case
		switch (trackType) {
			case 'general': {
				// eslint-disable-next-line default-case
				switch (property) {
					case 'bitrate': {
						// TODO Improve type
						return track.overallbitrate as string;
					}
				}
			}
		}

		// See if the property is there
		if (track[property]) {
			return track[property] as string; // TODO Improve type
		}

		throw new Error(`[get] could not find '${property}' in '${trackType}'`);
	}

	getTrack(trackType: string): MediainfoTrack {
		for (const track of this.metadata.media.track) {
			// eslint-disable-next-line no-underscore-dangle
			if (trackType.toLocaleLowerCase() === track._type.toLocaleLowerCase()) {
				return track;
			}
		}

		throw new Error(`Track type '${trackType}' not found`);
	}

	getDataForSerialization(): MediainfoMetadataSerialized {
		return {
			metadata: this.metadata
		};
	}
}
