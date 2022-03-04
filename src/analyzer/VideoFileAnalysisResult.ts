import { IVideoFileAnalysisResult } from './interfaces/IVideoFileAnalysisResult';
import { IVideoRuleResult } from './interfaces/IVideoRuleResult';

export class VideoFileAnalysisResult implements IVideoFileAnalysisResult {
	public readonly videoRuleResults: IVideoRuleResult[];

	/**
	 * @param videoRuleResults - Should only contain relevant results - i.e. results for Rules that _matched_ somehow
	 */
	constructor(videoRuleResults: IVideoRuleResult[]) {
		this.videoRuleResults = videoRuleResults;
	}

	get isSatisfied(): boolean {
		const anyNotSatisfied = this.videoRuleResults.find(result => !result.isSatisfied);
		if (anyNotSatisfied) {
			return false;
		}

		return true;
	}
}
