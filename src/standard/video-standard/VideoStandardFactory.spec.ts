import { mock, MockProxy } from 'jest-mock-extended';

import { IVideoRule } from './IVideoRule';
import { IVideoRuleFactory } from './IVideoRuleFactory';
import { IVideoStandardFactory } from './IVideoStandardFactory';
import { VideoRuleSerialized } from './VideoStandardSchema';
import { VideoStandardFactory } from './VideoStandardFactory';

describe('VideoStandardFactory', () => {
	let ruleFactoryMock: MockProxy<IVideoRuleFactory>;
	let videoStandardFactory: IVideoStandardFactory;
	beforeEach(() => {
		ruleFactoryMock = mock<IVideoRuleFactory>();
		videoStandardFactory = new VideoStandardFactory(ruleFactoryMock);
	});

	describe('create', () => {
		it('should return VideoStandard with 1 rule and error-detector options set', () => {
			ruleFactoryMock.create
				.calledWith('rule1' as VideoRuleSerialized)
				.mockReturnValueOnce('Rule1' as unknown as IVideoRule);
			const result = videoStandardFactory.create({
				'error-detector': {
					'demux-only': true
				},
				rules: ['rule1' as VideoRuleSerialized]
			});
			expect(result.videoErrorDetectorConfiguration.demuxOnly).toBe(true);
			expect(result.rules).toHaveLength(1);
		});
	});
});
