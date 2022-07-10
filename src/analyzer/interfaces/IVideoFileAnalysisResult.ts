import { IFileAnalysisResult } from './IFileAnalysisResult';
import { IVideoRuleResult } from './IVideoRuleResult';

export interface IVideoFileAnalysisResult extends IFileAnalysisResult {
	readonly videoRuleResults: IVideoRuleResult[];
}
