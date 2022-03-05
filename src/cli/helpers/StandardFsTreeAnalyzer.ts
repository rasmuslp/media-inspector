import { CliUx } from '@oclif/core';

import { IFileAnalysisResult } from '../../analyzer/interfaces/IFileAnalysisResult';
import { IFileAnalyzer } from '../../analyzer/interfaces/IFileAnalyzer';
import { File, FsNode, FsTree } from '../../fs-tree';
import { IStandardFsTreeAnalyzer } from './IStandardFsTreeAnalyzer';

export class StandardFsTreeAnalyzer implements IStandardFsTreeAnalyzer {
	private readonly fileAnalyzer: IFileAnalyzer;

	constructor(fileAnalyzer: IFileAnalyzer) {
		this.fileAnalyzer = fileAnalyzer;
	}

	public async analyze(tree: FsTree, verbose = false): Promise<Map<FsNode, IFileAnalysisResult>> {
		if (verbose) {
			CliUx.ux.action.start('Analyzing...');
		}

		const analysisResults = new Map<FsNode, IFileAnalysisResult>();
		await tree.traverse(async (node: FsNode) => {
			if (node.name.startsWith('.')) {
				// Skip hidden files. Don't know what these are, but macOS can sure generate some strange looking files, that produce some strange looking MediainfoMetadata.
				return;
			}

			if (node instanceof File) {
				const fileAnalysisResult = this.fileAnalyzer.analyze(node);
				if (fileAnalysisResult) {
					analysisResults.set(node, fileAnalysisResult);
				}
			}
		});

		if (verbose) {
			CliUx.ux.action.stop();
			console.log(`Processed ${analysisResults.size} file${analysisResults.size === 1 ? 's' : ''}`);
		}

		return analysisResults;
	}
}
