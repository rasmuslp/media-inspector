import { MediainfoMetadataFactory } from './MediainfoMetadataFactory';

import mediainfoOutput from '../../test-assets/SampleVideo_1280x720_1mb.mediainfo';

describe('MediainfoMetadataFactory', () => {
	const partialPath = 'test-assets/SampleVideo_1280x720_1mb.mp4';

	test(`can _readFromFile '${partialPath}'`, async () => {
		const metadata = await MediainfoMetadataFactory._readFromFileSystem(partialPath);
		expect(metadata).toMatchObject(mediainfoOutput);
	});
});
