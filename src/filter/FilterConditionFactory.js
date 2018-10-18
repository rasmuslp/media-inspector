const crypto = require('crypto');

const FilterCondition = require('./FilterCondition');

class FilterConditionFactory {
	constructor() {
		this._filterConditions = new Map();
	}

	getFilterCondition(condition) {
		// Calculate hash of input
		const hash = crypto.createHash('md5').update(JSON.stringify(condition)).digest('hex');

		// Check if already available
		if (this._filterConditions.has(hash)) {
			return this._filterConditions.get(hash);
		}

		// Otherwise create and store
		const filterCondition = new FilterCondition(condition);
		this._filterConditions.set(hash, filterCondition);

		return filterCondition;
	}
}

module.exports = new FilterConditionFactory();
