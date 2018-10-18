const fs = require('fs');
const util = require('util');

const FilterConditionFactory = require('./FilterConditionFactory');

const readFileAsync = util.promisify(fs.readFile);

async function filterLoader(filterPath) {
	// Load filter
	let filterByType;
	try {
		const data = await readFileAsync(filterPath);
		filterByType = JSON.parse(data);
	}
	catch (e) {
		throw new Error(`Could not read and parse filter at '${filterPath}'`, e);
	}

	// Transform loaded filter into FilterConditions
	// For each type
	for (const [type, filters] of Object.entries(filterByType)) {
		// Transform all the filters
		const transformedFilters = [];
		for (const filter of filters) {
			// Transform all the conditions of a filter
			const transformedConditions = [];
			for (const condition of filter) {
				try {
					transformedConditions.push(FilterConditionFactory.getFilterCondition(condition));
				}
				catch (e) {
					const filterNumber = transformedConditions.length + 1;
					throw new Error(`Could not construct FilterCondition for '[${type}]#${filterNumber}'`, {
						condition,
						error: e
					});
				}
			}

			transformedFilters.push(transformedConditions);
		}

		filterByType[type] = transformedFilters;
	}

	return filterByType;
}

module.exports = filterLoader;
