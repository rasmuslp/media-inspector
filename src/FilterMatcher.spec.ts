import { FilterConditionFactory } from './filter/filter-condition/FilterConditionFactory';
import { VideoFile} from './fs-tree';
import { MediainfoMetadata } from'./mediainfo/MediainfoMetadata';
import { FilterMatcher } from './FilterMatcher';

const mediainfoOutput = require('../test-assets/SampleVideo_1280x720_1mb.mediainfo');
const partialPath = 'test-assets/SampleVideo_1280x720_1mb.mp4';

describe('FileMatcher', () => {
	test(`_checkFilterForMediaFile missing metadata property doesn't result in error`, () => {
		const metadata = new MediainfoMetadata(mediainfoOutput.default);
		// @ts-ignore
		const mediaFile = new VideoFile(partialPath, { size: 0 }, 'video/whatever', metadata);

		FilterMatcher._checkFilterForMediaFile([
			FilterConditionFactory.createFilterCondition({
				path: 'general.dummy',
				operator: '>=',
				value: 1
			})
		], mediaFile);
	});
});
