import { File } from '../fs-tree';
import { IFileAnalysisResult } from './IFileAnalysisResult';

export interface IFileStandardAnalyzer {
	canAnalyze(file: File): boolean,
	analyze(file: File): IFileAnalysisResult
}
