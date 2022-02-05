import { ICondition } from './ICondition';

export enum ConditionSatisfied {
	YES,
	NO
}

export class ConditionResult {
	private readonly condition: ICondition;

	private readonly value: number | string;

	private readonly satisfied: ConditionSatisfied;

	constructor(condition: ICondition, value: number | string, satisfied: ConditionSatisfied) {
		this.condition = condition;
		this.value = value;
		this.satisfied = satisfied;
	}

	get isSatisfied(): boolean {
		return this.satisfied === ConditionSatisfied.YES;
	}

	getResultAsStrings(): string {
		const message = `${this.condition.path} ${this.isSatisfied ? 'satisfied' : 'failed'}: ${this.condition.toStringForValue(this.value)}`;

		return message;
	}
}
