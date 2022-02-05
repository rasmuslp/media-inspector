import { ICondition } from '../condition/ICondition';

export interface IRuleMatch {
	fileExtension?: string,
	mimeType?: string
}

export interface IRule {
	name: string,
	match?: IRuleMatch,
	type: string,
	conditions: ICondition[]
}
