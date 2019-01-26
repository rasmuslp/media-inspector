import fs from 'fs';
import util from 'util';

import JSON5 from 'json5';

import { FilterConditionFactory } from './FilterConditionFactory';

const readFileAsync = util.promisify(fs.readFile);

export async function filterLoader(filterPath) {
	// Load filter
	let filterByType;
	try {
		const data = await readFileAsync(filterPath);
		filterByType = JSON5.parse(data);
	}
	catch (e) {
		throw new Error(`Could not read and parse filter at '${filterPath}': ${e.message}`);
	}

	// Transform loaded filter into FilterConditions
	// For each type
	for (const [type, filters] of Object.entries(filterByType)) {
		// Transform all the filters
		const transformedFilters = [];
		// @ts-ignore
		for (const filter of filters) {
			// Transform all the conditions of a filter
			const transformedConditions = [];
			for (const condition of filter) {
				try {
					transformedConditions.push(FilterConditionFactory.getFilterCondition(condition));
				}
				catch (e) {
					const filterNumber = transformedConditions.length + 1;
					throw new Error(`Could not construct FilterCondition for '[${type}]#${filterNumber}': ${e.message}`);
				}
			}

			transformedFilters.push(transformedConditions);
		}

		filterByType[type] = transformedFilters;
	}

	return filterByType;
}
