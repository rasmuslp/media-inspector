import { StandardSatisfied } from './StandardSatisfied';
import { VideoFileAnalysisResult } from './VideoFileAnalysisResult';

describe('VideoFileAnalysisResult', () => {
	describe('satisfied', () => {
		it('should return YES provided 2 satisfied IVideoRuleResults', () => {
			const videoFileAnalysisResult = new VideoFileAnalysisResult([{
				name: '1 satisfied',
				isSatisfied: true
			}, {
				name: '2 satisfied',
				isSatisfied: true
			}]);

			const result = videoFileAnalysisResult.standardSatisfied();

			expect(result).toBe(StandardSatisfied.YES);
		});

		it('should return NO provided 1 satisfied IVideoRuleResult and 1 not satisfied IVideoRuleResult', () => {
			const videoFileAnalysisResult = new VideoFileAnalysisResult([{
				name: '1 satisfied',
				isSatisfied: true
			}, {
				name: '2 not satisfied',
				isSatisfied: false
			}]);

			const result = videoFileAnalysisResult.standardSatisfied();

			expect(result).toBe(StandardSatisfied.NO);
		});

		it('should return NOT_APPLICABLE provided empty list of IVideoRuleResults', () => {
			const videoFileAnalysisResult = new VideoFileAnalysisResult([]);

			const result = videoFileAnalysisResult.standardSatisfied();

			expect(result).toBe(StandardSatisfied.NOT_APPLICABLE);
		});
	});
});
