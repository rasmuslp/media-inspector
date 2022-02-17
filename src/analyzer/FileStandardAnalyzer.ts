import { File } from '../fs-tree';
import { IStandard } from '../standard/IStandard';
import { IFileAnalysisResult } from './IFileAnalysisResult';
import { IFileStandardAnalyzer } from './IFileStandardAnalyzer';
import { IVideoFileAnalyzer } from './IVideoFileAnalyzer';

export class FileStandardAnalyzer implements IFileStandardAnalyzer {
	private readonly videoFileAnalyzer: IVideoFileAnalyzer;

	private readonly standard: IStandard;

	constructor(videoFileAnalyzer: IVideoFileAnalyzer, standard: IStandard) {
		this.videoFileAnalyzer = videoFileAnalyzer;
		this.standard = standard;
	}

	public analyze(file: File): IFileAnalysisResult | undefined {
		const fileMimeType = file.getMimeTypeWithoutSubtype();
		switch (fileMimeType) {
			case 'video': {
				return this.videoFileAnalyzer.analyze(this.standard.videoStandard, file);
			}

			default:
				return undefined;
		}
	}
}
