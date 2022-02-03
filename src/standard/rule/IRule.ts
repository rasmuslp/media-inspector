import { ICondition } from '../condition/ICondition';

export interface IRule {
	mimeType: string;
	conditions: ICondition[];
}
