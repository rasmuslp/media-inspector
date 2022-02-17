import { File } from '../fs-tree';
import { IVideoStandard } from '../standard/video-standard/IVideoStandard';
import { IFileAnalysisResult } from './IFileAnalysisResult';
import { IVideoFileAnalyzer } from './IVideoFileAnalyzer';
import { IVideoRuleResult } from './IVideoRuleResult';
import { VideoRuleResult } from './VideoRuleResult';
import { VideoFileAnalysisResult } from './VideoFileAnalysisResult';
import { IVideoFileRuleMatcher } from './IVideoFileRuleMatcher';
import { IVideoFileRuleConditionsAnalyzer } from './IVideoFileRuleConditionsAnalyzer';

export class VideoFileAnalyzer implements IVideoFileAnalyzer {
	private readonly videoFileRuleMatcher: IVideoFileRuleMatcher;

	private readonly videoFileRuleConditionsAnalyzer: IVideoFileRuleConditionsAnalyzer;

	constructor(videoFileRuleMatcher: IVideoFileRuleMatcher, videoFileRuleConditionsAnalyzer: IVideoFileRuleConditionsAnalyzer) {
		this.videoFileRuleMatcher = videoFileRuleMatcher;
		this.videoFileRuleConditionsAnalyzer = videoFileRuleConditionsAnalyzer;
	}

	public analyze(videoStandard: IVideoStandard, file: File): IFileAnalysisResult | undefined {
		const videoRuleResults: IVideoRuleResult[] = [];
		for (const rule of videoStandard.rules) {
			const matches = this.videoFileRuleMatcher.match(file, rule.match);
			if (!matches) {
				continue;
			}

			const conditionResults = this.videoFileRuleConditionsAnalyzer.analyze(file.path, rule);
			const videoRuleResult = new VideoRuleResult(rule.name, conditionResults);
			videoRuleResults.push(videoRuleResult);
		}

		if (videoRuleResults.length === 0) {
			return undefined;
		}

		return new VideoFileAnalysisResult(videoRuleResults);
	}
}
