import { ICondition } from '../condition/ICondition';
import { IRule } from './IRule';

export class Rule implements IRule {
	public readonly mimeType: string;

	private readonly theConditions: ICondition[];

	constructor(mimeType: string, conditions: ICondition[] = []) {
		this.mimeType = mimeType;
		this.theConditions = conditions;
	}

	get conditions(): ICondition[] {
		return [...this.theConditions];
	}
}
