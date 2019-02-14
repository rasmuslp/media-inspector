import { FilterCondition } from '../FilterCondition';

export abstract class FilterConditionResult {
	_filterCondition: FilterCondition;
	_value;

	constructor(filterCondition: FilterCondition, value) {
		this._filterCondition = filterCondition;
		this._value = value;
	}

	abstract get satisfied(): boolean;

	toString() {
		const message = `${this._filterCondition.path} ${this.satisfied ? 'satisfied' : 'failed'}: ${this._filterCondition.toStringForValue(this._value)}`;

		return message;
	}
}
