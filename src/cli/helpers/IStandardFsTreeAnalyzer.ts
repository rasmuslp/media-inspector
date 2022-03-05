import { IFileAnalysisResult } from '../../analyzer/interfaces/IFileAnalysisResult';
import { FsNode, FsTree } from '../../fs-tree';

export interface IStandardFsTreeAnalyzer {
	analyze(tree: FsTree, verbose: boolean): Promise<Map<FsNode, IFileAnalysisResult>>
}
