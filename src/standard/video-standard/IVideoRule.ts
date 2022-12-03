import { ICondition } from '../condition/ICondition';

export interface IVideoRuleMatch {
	fileExtension?: string;
	metadata?: ICondition[];
	mimeType?: string;
}

export interface IVideoRule {
	name: string;
	match?: IVideoRuleMatch;
	type: string;
	conditions: ICondition[];
}
