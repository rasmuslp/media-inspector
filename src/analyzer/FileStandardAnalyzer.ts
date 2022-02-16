import { File } from '../fs-tree';
import { IStandard } from '../standard/IStandard';
import { TypeNotSupportedResult } from './result/TypeNotSupportedResult';
import { VideoFileAnalysisResult } from './result/VideoFileAnalysisResult';
import { IFileAnalysisResult } from './IFileAnalysisResult';
import { IFileStandardAnalyzer } from './IFileStandardAnalyzer';
import { IVideoFileRuleConditionsAnalyzer } from './IVideoFileRuleConditionsAnalyzer';
import { IVideoFileRuleMatcher } from './IVideoFileRuleMatcher';
import { IVideoRuleResult } from './IVideoRuleResult';
import { VideoRuleResult } from './VideoRuleResult';

export class FileStandardAnalyzer implements IFileStandardAnalyzer {
	private readonly standard: IStandard;

	private readonly videoFileRuleMatcher: IVideoFileRuleMatcher;

	private readonly videoFileRuleConditionsAnalyzer: IVideoFileRuleConditionsAnalyzer;

	constructor(standard: IStandard, videoFileRuleMatcher: IVideoFileRuleMatcher, videoFileRuleConditionsAnalyzer: IVideoFileRuleConditionsAnalyzer) {
		this.standard = standard;
		this.videoFileRuleMatcher = videoFileRuleMatcher;
		this.videoFileRuleConditionsAnalyzer = videoFileRuleConditionsAnalyzer;
	}

	public analyze(file: File): IFileAnalysisResult {
		const fileMimeType = file.getMimeTypeWithoutSubtype();
		if (fileMimeType !== 'video') {
			return new TypeNotSupportedResult(fileMimeType);
		}

		const ruleResults: IVideoRuleResult[] = [];
		for (const rule of this.standard.videoStandard.rules) {
			const matches = this.videoFileRuleMatcher.match(file, rule.match);
			if (!matches) {
				continue;
			}

			const conditionResults = this.videoFileRuleConditionsAnalyzer.analyze(file.path, rule);
			const videoRuleResult = new VideoRuleResult(rule.name, conditionResults);
			ruleResults.push(videoRuleResult);
		}

		return new VideoFileAnalysisResult(ruleResults);
	}
}
