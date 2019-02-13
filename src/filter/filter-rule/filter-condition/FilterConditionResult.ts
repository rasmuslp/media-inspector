import { FilterCondition } from './FilterCondition';

export class FilterConditionResult {
	_filterCondition: FilterCondition;
	_value;
	_passed: boolean;

	constructor(filterCondition: FilterCondition, value, passed: boolean) {
		this._filterCondition = filterCondition;
		this._value = value;
		this._passed = passed;
	}

	get passed() {
		return this._passed;
	}

	set passed(value) {
		this._passed = value;
	}

	toString() {
		let message = `${this._filterCondition.path} ${this.passed ? 'passed' : 'failed'}: ${this._filterCondition.toStringForValue(this._value)}`;

		return message;
	}
}
