import { IFileAnalysisResult } from '../IFileAnalysisResult';
import { StandardSatisfied } from '../StandardSatisfied';

export class TypeNotSupportedResult implements IFileAnalysisResult {
	private readonly mimeType: string;

	constructor(mimeType: string) {
		this.mimeType = mimeType;
	}

	public standardSatisfied(): StandardSatisfied {
		return StandardSatisfied.NOT_APPLICABLE;
	}
}
