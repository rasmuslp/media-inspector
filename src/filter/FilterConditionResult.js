class FilterConditionResult {
	constructor({ filterCondition, value, passed = false }) {
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
		let message = `${this._filterCondition.path} ${this.passed ? 'passed' : 'failed'}: `;
		message += `'${this._value}' ${this._filterCondition}`;

		return message;
	}
}

module.exports = FilterConditionResult;
