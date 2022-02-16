import { File } from '../fs-tree';
import { IFileAnalysisResult } from './IFileAnalysisResult';

export interface IFileStandardAnalyzer {
	analyze(file: File): IFileAnalysisResult
}
