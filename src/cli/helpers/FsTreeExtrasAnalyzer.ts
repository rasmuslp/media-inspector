import { IFileAnalysisResult } from '../../analyzer/interfaces/IFileAnalysisResult';
import { VideoFileAnalysisResult } from '../../analyzer/VideoFileAnalysisResult';
import { Directory, FsNode, FsTree } from '../../fs-tree';
import { IPrintable } from './printable/IPrintable';
import { PrintableAuxiliaryResult } from './printable/PrintableAuxiliaryResult';
import { PrintableVideoResult } from './printable/PrintableVideoResult';

export class FsTreeExtrasAnalyzer {
	public async analyze(tree: FsTree, analysisResults: Map<FsNode, IFileAnalysisResult>, satisfied: boolean, includeEmpty: boolean, includeAuxiliary: number): Promise<Map<FsNode, IPrintable>> {
		const printableResults = new Map<FsNode, IPrintable>();

		// Process analysis results
		for (const [file, fileAnalysisResult] of analysisResults.entries()) {
			const seekingSatisfiedAndFileSatisfied = satisfied && fileAnalysisResult.isSatisfied;
			const seekingNonSatisfiedAndFileNotSatisfied = !satisfied && !fileAnalysisResult.isSatisfied;

			if (seekingSatisfiedAndFileSatisfied || seekingNonSatisfiedAndFileNotSatisfied) {
				if (fileAnalysisResult instanceof VideoFileAnalysisResult) {
					printableResults.set(file, new PrintableVideoResult(fileAnalysisResult));
				}
				else {
					throw new TypeError('fileAnalysisResult must be instance of VideoFileAnalysisResult');
				}
			}
		}

		// Process tree with extra flags
		if (!satisfied) {
			if (includeEmpty) {
				await tree.traverse(async (node: FsNode) => {
					if (node instanceof Directory) {
						const children = tree.getDirectChildren(node);
						if (children.length === 0) {
							printableResults.set(node, new PrintableAuxiliaryResult('Directory empty'));
						}
					}
				});
			}

			if (includeAuxiliary) {
				// TODO: I need proper DFS to ensure that parent dirs will capture children that are marked for matcher
				await tree.traverse(async (node: FsNode) => {
					if (node instanceof Directory) {
						const children = tree.getDirectChildren(node);
						if (children.length > 0) {
							const matchedChildren = children.filter(i => printableResults.has(i));

							// Get sizes of matched children
							let sizeOfMatchedChildren = 0;
							for (const child of matchedChildren) {
								// I don't think this will capture the true size of the matched sub-tree. Size of Directories are 0, and I get only direct children.
								sizeOfMatchedChildren += child.size;
							}

							const sizeOfTree = await tree.getSize(node);

							if (sizeOfMatchedChildren >= includeAuxiliary * sizeOfTree) {
								// Match whole sub-tree
								const subTreeAsList = await tree.getAsList(node);
								const newAuxiliaryMatches = subTreeAsList.filter(i => !printableResults.has(i));
								for (const match of newAuxiliaryMatches) {
									printableResults.set(match, new PrintableAuxiliaryResult(`Auxiliary to ${node.path}`));
								}
							}
						}
					}
				});
			}
		}

		return printableResults;
	}
}
