import { File } from '../../fs-tree';
import { IVideoStandard } from '../../standard/video-standard/IVideoStandard';
import { IFileAnalysisResult } from './IFileAnalysisResult';

export interface IVideoFileAnalyzer {
	analyze(videoStandard: IVideoStandard, file: File): IFileAnalysisResult | undefined
}
