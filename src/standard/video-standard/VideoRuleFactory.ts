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

		return new VideoRule(serialized.name, serialized.match, serialized.type, conditions);
	}
}
