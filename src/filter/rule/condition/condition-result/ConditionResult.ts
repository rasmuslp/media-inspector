import { Condition } from '../Condition';

export abstract class ConditionResult {
	_condition: Condition;
	_value;

	constructor(condition: Condition, value) {
		this._condition = condition;
		this._value = value;
	}

	abstract get satisfied(): boolean;

	toString(): string {
		const message = `${this._condition.path} ${this.satisfied ? 'satisfied' : 'failed'}: ${this._condition.toStringForValue(this._value)}`;

		return message;
	}
}
