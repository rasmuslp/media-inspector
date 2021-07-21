import { z } from 'zod';

import { Metadata } from '../Metadata';
import { Serializable, SerializableSchema } from '../../serializable/Serializable';

const MiTrackKnownSchema = z.object({
	_type: z.string()
});
const MiTrackUnknownSchema = z.record(z.union([z.string(), z.record(z.string())]));
// const MiTrackUnknownSchema = z.record(z.union([z.string(), z.unknown()]));
const MiTrackSchema = MiTrackKnownSchema.and(MiTrackUnknownSchema);
type MiTrackData = z.infer<typeof MiTrackSchema>;

const MiMetadataRawSchema = z.object({
	media: z.object({
		track: z.array(MiTrackSchema)
	})
});

export type MiMetadataRawData = z.infer<typeof MiMetadataRawSchema>;

export const MiMetadataSchema = SerializableSchema.extend({
	metadata: MiMetadataRawSchema
});

export type MiMetadataData = z.infer<typeof MiMetadataSchema>;

export class MediainfoMetadata extends Serializable<MiMetadataData> implements Metadata {
	constructor(metadata: MiMetadataRawData) {
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
						return track.overallbitrate as string; // TODO Improve type
				}
			}
		}

		// See if the property is there
		if (track[property]) {
			return track[property] as string; // TODO Improve type
		}

		throw new Error(`[get] could not find '${property}' in '${trackType}'`);
	}

	getTrack(trackType: string): MiTrackData {
		for (const track of this.data.metadata.media.track) {
			if (trackType.toLocaleLowerCase() === track._type.toLocaleLowerCase()) {
				return track;
			}
		}

		throw new Error(`Track type '${trackType}' not found`);
	}
}
