import { MediainfoMetadata } from './MediainfoMetadata';
import { MediainfoMetadataFactory } from './MediainfoMetadataFactory';

import mediainfoOutput from '../../../test-assets/SampleVideo.mediainfo';

describe('MediainfoMetadataFactory', () => {
	const partialPath = 'test-assets/SampleVideo.mov';

	test(`can _readFromFile '${partialPath}'`, async () => {
		const metadata = await MediainfoMetadataFactory._readFromFileSystem(partialPath);
		expect(metadata).toMatchObject(mediainfoOutput);
	});

	test(`.getFromFileSystem() returns MediainfoMetadata from '${partialPath}'`, async () => {
		const mediainfoMetadata = await MediainfoMetadataFactory.getFromFileSystem(partialPath);
		expect(mediainfoMetadata).toBeInstanceOf(MediainfoMetadata);
		expect(mediainfoMetadata.data.metadata).toMatchObject(mediainfoOutput);
	});
});
