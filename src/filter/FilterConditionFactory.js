const crypto = require('crypto');

const FilterConditionEq = require('./filter-conditions/FilterConditionEq');
const FilterConditionGe = require('./filter-conditions/FilterConditionGe');
const FilterConditionIn = require('./filter-conditions/FilterConditionIn');

class FilterConditionFactory {
	constructor() {
		this._filterConditions = new Map();
	}

	static _createFilterCondition(inputCondition) {
		// Warn and fix input
		if (inputCondition.comparator) {
			console.log(`[FilterConditionFactory] The 'comparator' option is deprecated. Use 'operator' instead.`);
		}
		const condition = Object.assign({}, inputCondition, {
			operator: inputCondition.operator || inputCondition.comparator
		});

		// Create and return
		switch (condition.operator) {
			case 'in':
				return new FilterConditionIn(condition);

			case 'string':
				console.log(`[FilterConditionFactory] The 'string' operator is deprecated. Use '=' instead.`);
				// falls through
			case '=':
				return new FilterConditionEq(condition);

			case '>=':
				return new FilterConditionGe(condition);

			default:
				throw new Error(`Unknown operator '${condition.operator}' in ${JSON.stringify(inputCondition)}`);
		}
	}

	getFilterCondition(condition) {
		// Calculate hash of input
		const hash = crypto.createHash('md5').update(JSON.stringify(condition)).digest('hex');

		// Check if already available
		if (this._filterConditions.has(hash)) {
			return this._filterConditions.get(hash);
		}

		// Otherwise create and store for future reuse
		const filterCondition = this.constructor._createFilterCondition(condition);
		this._filterConditions.set(hash, filterCondition);

		return filterCondition;
	}
}

module.exports = new FilterConditionFactory();
