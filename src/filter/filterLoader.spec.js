const filterLoader = require('./filterLoader');
const FilterCondition = require('../FilterCondition');

const filterPath = 'test-assets/filter-simple.json';

describe(filterPath, () => {
	test('can load', async () => {
		// Load filters
		const loadedFilters = await filterLoader(filterPath);

		// Test content of transformed filters
		expect(loadedFilters).toHaveProperty('video');
		for (const filter of loadedFilters.video) {
			for (const condition of filter) {
				expect(condition).toBeInstanceOf(FilterCondition);
			}
		}
	});
});
