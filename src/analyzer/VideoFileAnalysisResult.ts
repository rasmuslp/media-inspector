import { IFileAnalysisResult } from './IFileAnalysisResult';
import { IVideoRuleResult } from './IVideoRuleResult';
import { StandardSatisfied } from './StandardSatisfied';

export class VideoFileAnalysisResult implements IFileAnalysisResult {
	private readonly videoRuleResults: IVideoRuleResult[];

	/**
	 * @param videoRuleResults - Should only contain relevant results - i.e. results for Rules that _matched_ somehow
	 */
	constructor(videoRuleResults: IVideoRuleResult[]) {
		this.videoRuleResults = videoRuleResults;
	}

	public standardSatisfied(): StandardSatisfied {
		if (this.videoRuleResults.length === 0) {
			// Hmm, so now I'm encoding domain knowledge.
			// Alternatively, I should have all videoRuleResults, and how each of them matched on the file.
			return StandardSatisfied.NOT_APPLICABLE;
		}

		const anyNotSatisfied = this.videoRuleResults.find(result => !result.isSatisfied);
		if (anyNotSatisfied) {
			return StandardSatisfied.NO;
		}

		return StandardSatisfied.YES;
	}

	getVideoRuleResults(): IVideoRuleResult[] {
		return this.videoRuleResults;
	}
}
