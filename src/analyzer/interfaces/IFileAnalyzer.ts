import { File } from '../../fs-tree';
import { IFileAnalysisResult } from './IFileAnalysisResult';

export interface IFileAnalyzer {
	analyze(file: File): IFileAnalysisResult | undefined;
}
