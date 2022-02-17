import { StandardSatisfied } from '../StandardSatisfied';

// TODO: Make IFileAnalysisResult generic? isSatisfied
export interface IFileAnalysisResult {
	standardSatisfied(): StandardSatisfied
}
