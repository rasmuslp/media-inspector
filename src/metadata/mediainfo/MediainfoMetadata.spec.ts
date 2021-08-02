import mediainfoOutput from '../../../test-assets/SampleVideo.mediainfo';
import { MediainfoMetadata } from './MediainfoMetadata';

describe('MediainfoMetadata', () => {
	let mediainfoMetadata: MediainfoMetadata;
	beforeEach(() => {
		mediainfoMetadata = new MediainfoMetadata(mediainfoOutput);
	});

	it('.getTrack() returns the first matching track', () => {
		const result = mediainfoMetadata.getTrack('video');
		// eslint-disable-next-line no-underscore-dangle
		expect(result._type).toEqual('Video');
	});

	it('.getProperty() returns bitrate of video', () => {
		const result = mediainfoMetadata.getProperty('video', 'bitrate');
		expect(result).toBe('23855');
	});

	it('.getProperty() returns bitrate of file via property modifier', () => {
		const result = mediainfoMetadata.getProperty('general', 'bitrate');
		expect(result).toBe('33264');
	});

	it('.get() returns bitrate of video', () => {
		const result = mediainfoMetadata.get('video.bitrate');
		expect(result).toBe(23_855);
	});

	it('.getDataForSerialization() returns MediainfoMetadataSerialized', () => {
		const result = mediainfoMetadata.getDataForSerialization();
		expect(result).toStrictEqual({
			metadata: mediainfoOutput
		});
	});
});
