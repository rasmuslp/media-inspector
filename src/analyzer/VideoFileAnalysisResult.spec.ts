import { VideoFileAnalysisResult } from './VideoFileAnalysisResult';

describe('VideoFileAnalysisResult', () => {
	describe('isSatisfied', () => {
		it('should return true provided 2 satisfied IVideoRuleResults', () => {
			const videoFileAnalysisResult = new VideoFileAnalysisResult([{
				name: '1 satisfied',
				isSatisfied: true
			}, {
				name: '2 satisfied',
				isSatisfied: true
			}]);

			const result = videoFileAnalysisResult.isSatisfied;

			expect(result).toBe(true);
		});

		it('should return false provided 1 satisfied IVideoRuleResult and 1 not satisfied IVideoRuleResult', () => {
			const videoFileAnalysisResult = new VideoFileAnalysisResult([{
				name: '1 satisfied',
				isSatisfied: true
			}, {
				name: '2 not satisfied',
				isSatisfied: false
			}]);

			const result = videoFileAnalysisResult.isSatisfied;

			expect(result).toBe(false);
		});

		it('should return true provided empty list of IVideoRuleResults - as it didn\'t fail any rules and conditions', () => {
			const videoFileAnalysisResult = new VideoFileAnalysisResult([]);

			const result = videoFileAnalysisResult.isSatisfied;

			expect(result).toBe(true);
		});
	});
});
