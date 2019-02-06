import { MediainfoMetadataFactory } from './MediainfoMetadataFactory';

const mediainfoOutput = require('../../test-assets/SampleVideo_1280x720_1mb.mediainfo');
const partialPath = 'test-assets/SampleVideo_1280x720_1mb.mp4';

describe('MediainfoMetadataFactory', () => {
	test(`can _readFromFile '${partialPath}'`, async () => {
		const metadata = await MediainfoMetadataFactory._readFromFileSystem(partialPath);
		expect(metadata).toMatchObject(mediainfoOutput);
	});
});
