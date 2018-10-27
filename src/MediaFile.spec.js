const FilterCondition = require('./filter/FilterCondition');
const MediaFile = require('./MediaFile');
const MediainfoMetadata = require('./mediainfo/MediainfoMetadata');

const mediainfoOutput = require('../test-assets/SampleVideo_1280x720_1mb.mediainfo');
const partialPath = 'test-assets/SampleVideo_1280x720_1mb.mp4';

describe('checkFilter', () => {
	test(`missing metadata property doesn't result in error`, () => {
		const mediaFile = new MediaFile(partialPath, { size: 0 }, 'video');
		mediaFile._metadata = new MediainfoMetadata(mediainfoOutput);

		mediaFile.checkFilter([
			new FilterCondition({
				path: 'general.dummy',
				operator: '>=',
				value: 1
			})
		]);
	});
});
