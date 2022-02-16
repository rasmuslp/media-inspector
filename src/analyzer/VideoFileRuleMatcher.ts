import { File } from '../fs-tree';
import { IMetadataGetter } from '../metadata/IMetadataGetter';
import { IVideoRuleMatch } from '../standard/video-standard/IVideoRule';
import { IConditionsAnalyzer } from './condition/IConditionsAnalyzer';
import { IVideoFileRuleMatcher } from './IVideoFileRuleMatcher';

export class VideoFileRuleMatcher implements IVideoFileRuleMatcher {
	private readonly metadataGetter: IMetadataGetter;

	private readonly conditionsAnalyzer: IConditionsAnalyzer;

	constructor(metadataGetter: IMetadataGetter, conditionsAnalyzer: IConditionsAnalyzer) {
		this.metadataGetter = metadataGetter;
		this.conditionsAnalyzer = conditionsAnalyzer;
	}

	public match(file: File, videoRuleMatch: IVideoRuleMatch): boolean {
		let requirementsToSatisfy = 0;
		let requirementsSatisfied = 0;

		if (videoRuleMatch.fileExtension) {
			requirementsToSatisfy += 1;
			if (file.extension === videoRuleMatch.fileExtension) {
				requirementsSatisfied += 1;
			}
		}

		if (videoRuleMatch.metadata) {
			requirementsToSatisfy += 1;

			// TODO: Handle that this might not return Metadata if there is none file file path
			const metadata = this.metadataGetter.getMetadata(file.path);

			const conditionResults = this.conditionsAnalyzer.analyze(videoRuleMatch.metadata, metadata);

			let allConditionsSatisfied = true;
			for (const conditionResult of conditionResults) {
				allConditionsSatisfied = allConditionsSatisfied && conditionResult.isSatisfied;
			}

			if (allConditionsSatisfied) {
				requirementsSatisfied += 1;
			}
		}

		if (videoRuleMatch.mimeType) {
			requirementsToSatisfy += 1;
			if (file.mimeType === videoRuleMatch.mimeType) {
				requirementsSatisfied += 1;
			}
		}

		return requirementsToSatisfy === requirementsSatisfied;
	}
}
