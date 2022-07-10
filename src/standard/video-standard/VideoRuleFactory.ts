import { IConditionFactory } from '../condition/IConditionFactory';

import { IVideoRule } from './IVideoRule';
import { IVideoRuleFactory } from './IVideoRuleFactory';
import { VideoRule } from './VideoRule';
import { VideoRuleSerialized } from './VideoStandardSchema';

export class VideoRuleFactory implements IVideoRuleFactory {
	private readonly conditionFactory: IConditionFactory;

	constructor(conditionFactory: IConditionFactory) {
		this.conditionFactory = conditionFactory;
	}

	create(serialized: VideoRuleSerialized): IVideoRule {
		const conditions = serialized.conditions.map(condition => this.conditionFactory.create(condition));

		const match = {
			fileExtension: serialized.match?.fileExtension,
			metadata: serialized.match?.metadata && serialized.match.metadata.map(condition => this.conditionFactory.create(condition)),
			mimeType: serialized.match?.mimeType
		};

		return new VideoRule(serialized.name, match, serialized.type, conditions);
	}
}
