import { IFileAnalysisResult } from '../../analyzer/interfaces/IFileAnalysisResult';
import { FsNode, FsTree } from '../../fs-tree';

export interface IFsTreeStandardAnalyzer {
	analyze(tree: FsTree, verbose: boolean): Promise<Map<FsNode, IFileAnalysisResult>>;
}
