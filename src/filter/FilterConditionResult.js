class FilterConditionResult {
	constructor({ filterCondition, conditionStringified, value, passed = false }) {
		this._filterCondition = filterCondition;
		this._conditionStringified = conditionStringified;
		this._value = value;
		this._passed = passed;
	}

	get path() {
		return this._filterCondition.path;
	}

	get conditionStringified() {
		return this._conditionStringified;
	}

	get passed() {
		return this._passed;
	}

	get value() {
		return this._value;
	}
}

module.exports = FilterConditionResult;
