import { ICondition } from '../condition/ICondition';
import { IRule, IRuleMatch } from './IRule';

export class Rule implements IRule {
	public readonly name: string;

	public readonly match: IRuleMatch;

	public readonly type: string;

	private readonly theConditions: ICondition[];

	constructor(name: string, match: IRuleMatch, type: string, conditions: ICondition[] = []) {
		this.name = name;
		this.match = match;
		this.type = type;
		this.theConditions = conditions;
	}

	get conditions(): ICondition[] {
		return [...this.theConditions];
	}
}
