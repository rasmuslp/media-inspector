import { ICondition } from '../../standard';
import { IConditionResult } from '../interfaces/IConditionResult';
import { ConditionSatisfied } from './ConditionSatisfied';

export class ConditionResult implements IConditionResult {
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

	getResultAsString(): string {
		const message = `${this.condition.path} ${this.isSatisfied ? 'satisfied' : 'not satisfied'}: ${this.condition.toStringForValue(this.value)}`;
		return message;
	}
}
