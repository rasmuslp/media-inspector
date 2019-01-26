import { read } from './mediainfo';

const mediainfoOutput = require('../../test-assets/SampleVideo_1280x720_1mb.mediainfo');
const partialPath = 'test-assets/SampleVideo_1280x720_1mb.mp4';

describe(`File '${partialPath}'`, () => {
	test('can read', async () => {
		const metadata = await read(partialPath);
		expect(metadata).toMatchObject(mediainfoOutput);
	});
});
