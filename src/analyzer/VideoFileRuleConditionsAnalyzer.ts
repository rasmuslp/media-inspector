import { IMetadataGetter } from '../metadata/IMetadataGetter';
import { IVideoRule } from '../standard/video-standard/IVideoRule';
import { IVideoErrorDetectorFactory } from '../video-error-detector/IVideoErrorDetectorFactory';
import { IConditionsAnalyzer } from './condition/IConditionsAnalyzer';
import { IConditionResult } from './condition/IConditionResult';
import { IVideoFileRuleConditionsAnalyzer } from './IVideoFileRuleConditionsAnalyzer';

export class VideoFileRuleConditionsAnalyzer implements IVideoFileRuleConditionsAnalyzer {
	private readonly conditionsAnalyzer: IConditionsAnalyzer;

	private readonly metadataGetter: IMetadataGetter;

	private readonly videoErrorDetectorFactory: IVideoErrorDetectorFactory;

	constructor(conditionsAnalyzer: IConditionsAnalyzer, metadataGetter: IMetadataGetter, videoErrorDetectorFactory: IVideoErrorDetectorFactory) {
		this.conditionsAnalyzer = conditionsAnalyzer;
		this.metadataGetter = metadataGetter;
		this.videoErrorDetectorFactory = videoErrorDetectorFactory;
	}

	public analyze(filePath: string, rule: IVideoRule): IConditionResult[] {
		const conditionResults: IConditionResult[] = [];
		switch (rule.type) {
			case 'metadata': {
				// TODO: Handle that this might not return Metadata if there is none file file path
				const metadata = this.metadataGetter.getMetadata(filePath);
				conditionResults.push(...this.conditionsAnalyzer.analyze(rule.conditions, metadata));

				break;
			}

			case 'error': {
				// Get errors
				// Check rule against error data

				break;
			}

			// TODO: Can I avoid this with an enum?
			default: {
				// Parsed data should make this impossible with enum

				break;
			}
		}

		return conditionResults;
	}
}
