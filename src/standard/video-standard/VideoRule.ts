import { ICondition } from '../condition/ICondition';
import { IVideoRule, IVideoRuleMatch } from './IVideoRule';

export class VideoRule implements IVideoRule {
	public readonly name: string;

	public readonly match: IVideoRuleMatch;

	public readonly type: string;

	private readonly theConditions: ICondition[];

	constructor(name: string, match: IVideoRuleMatch, type: string, conditions: ICondition[] = []) {
		if (conditions.length === 0) {
			throw new RangeError('VideoRule requires at least 1 condition');
		}

		this.name = name;
		this.match = match;
		this.type = type;
		this.theConditions = conditions;
	}

	get conditions(): ICondition[] {
		return [...this.theConditions];
	}
}
