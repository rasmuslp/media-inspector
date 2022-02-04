import { mock, MockProxy } from 'jest-mock-extended';

import { IRule } from '../rule/IRule';
import { IRuleFactory } from '../rule/IRuleFactory';
import { IVideoStandardFactory } from './IVideoStandardFactory';
import { VideoStandardFactory } from './VideoStandardFactory';
import { RuleSerialized } from '../rule/rule-schema';

describe('VideoStandardFactory', () => {
	let ruleFactoryMock: MockProxy<IRuleFactory>;
	let videoStandardFactory: IVideoStandardFactory;
	beforeEach(() => {
		ruleFactoryMock = mock<IRuleFactory>();
		videoStandardFactory = new VideoStandardFactory(ruleFactoryMock);
	});

	describe('create', () => {
		it('should return VideoStandard with 1 rule and error-detector options set', () => {
			ruleFactoryMock.create
				.calledWith('rule1' as RuleSerialized)
				.mockReturnValueOnce('Rule1' as unknown as IRule);
			const result = videoStandardFactory.create({
				'error-detector': {
					'demux-only': true
				},
				rules: ['rule1' as RuleSerialized]
			});
			expect(result.videoErrorDetectorConfiguration.demuxOnly).toBe(true);
			expect(result.rules).toHaveLength(1);
		});
	});
});
