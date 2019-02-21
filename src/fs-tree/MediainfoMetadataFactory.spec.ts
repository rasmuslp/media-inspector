import { MediainfoMetadataFactory } from './MediainfoMetadataFactory';

import mediainfoOutput from '../../test-assets/SampleVideo.mediainfo';

describe('MediainfoMetadataFactory', () => {
	const partialPath = 'test-assets/SampleVideo.mov';

	test(`can _readFromFile '${partialPath}'`, async () => {
		const metadata = await MediainfoMetadataFactory._readFromFileSystem(partialPath);
		expect(metadata).toMatchObject(mediainfoOutput);
	});
});
