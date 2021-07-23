import { Condition } from './Condition';

export enum ConditionSatisfied {
	YES,
	NO
}

export class ConditionResult {
	private readonly condition: Condition;
	private readonly value: unknown;
	private readonly satisfied: ConditionSatisfied;

	constructor(condition: Condition, value: unknown, satisfied: ConditionSatisfied) {
		this.condition = condition;
		this.value = value;
		this.satisfied = satisfied;
	}

	get isSatisfied(): boolean {
		return this.satisfied === ConditionSatisfied.YES;
	}

	toString(): string {
		const message = `${this.condition.path} ${this.isSatisfied ? 'satisfied' : 'failed'}: ${this.condition.toStringForValue(this.value.toString())}`;

		return message;
	}
}
