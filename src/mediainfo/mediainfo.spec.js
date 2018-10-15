const mediainfo = require('./mediainfo');

const mediainfoOutput = require('../../test-assets/SampleVideo_1280x720_1mb.mediainfo');
const partialPath = 'test-assets/SampleVideo_1280x720_1mb.mp4';

describe(partialPath, () => {
	test('can read', async () => {
		const metadata = await mediainfo.read(partialPath);
		expect(metadata).toMatchObject(mediainfoOutput);
	});
});
