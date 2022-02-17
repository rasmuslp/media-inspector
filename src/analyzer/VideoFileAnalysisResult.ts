import { IFileAnalysisResult } from './interfaces/IFileAnalysisResult';
import { IVideoRuleResult } from './interfaces/IVideoRuleResult';

export class VideoFileAnalysisResult implements IFileAnalysisResult {
	private readonly videoRuleResults: IVideoRuleResult[];

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

	getVideoRuleResults(): IVideoRuleResult[] {
		return this.videoRuleResults;
	}
}
