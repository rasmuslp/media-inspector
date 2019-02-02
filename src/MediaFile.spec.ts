import { FilterConditionFactory } from './filter/filter-conditions/FilterConditionFactory';
import { MediaFile } from'./MediaFile';
import { MediainfoMetadata } from'./mediainfo/MediainfoMetadata';

const mediainfoOutput = require('../test-assets/SampleVideo_1280x720_1mb.mediainfo');
const partialPath = 'test-assets/SampleVideo_1280x720_1mb.mp4';

describe('checkFilter', () => {
	test(`missing metadata property doesn't result in error`, () => {
		const mediaFile = new MediaFile(partialPath, { size: 0 }, 'video/whatever');
		mediaFile._metadata = new MediainfoMetadata(mediainfoOutput.default);

		mediaFile.checkFilter([
			FilterConditionFactory.createFilterCondition({
				path: 'general.dummy',
				operator: '>=',
				value: 1
			})
		]);
	});
});
