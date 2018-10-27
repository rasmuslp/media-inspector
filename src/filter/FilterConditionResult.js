class FilterConditionResult {
	constructor({ filterCondition, value, passed = false }) {
		this._filterCondition = filterCondition;
		this._value = value;
		this._passed = passed;
	}

	get path() {
		return this._filterCondition.path;
	}

	get conditionStringified() {
		return `${this._filterCondition.operator} ${this._filterCondition.expectedValue}`;
	}

	get passed() {
		return this._passed;
	}

	set passed(value) {
		this._passed = value;
	}

	get value() {
		return this._value;
	}
}

module.exports = FilterConditionResult;
