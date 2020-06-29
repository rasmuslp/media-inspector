import { Condition } from './Condition';

export enum ConditionSatisfied {
	YES,
	NO
}

export class ConditionResult {
	_condition: Condition;
	_value: unknown;
	_satisfied: ConditionSatisfied;

	constructor(condition: Condition, value: unknown, satisfied: ConditionSatisfied) {
		this._condition = condition;
		this._value = value;
		this._satisfied = satisfied;
	}

	get satisfied(): boolean {
		return this._satisfied === ConditionSatisfied.YES;
	}

	toString(): string {
		const message = `${this._condition.path} ${this.satisfied ? 'satisfied' : 'failed'}: ${this._condition.toStringForValue(this._value.toString())}`;

		return message;
	}
}
