import { FilterCondition } from './filter-condition/FilterCondition';
import { FilterFactory } from './FilterFactory';

const filterPath = 'test-assets/filter-simple.json5';

describe('FilterFactory', () => {
	test(`can getFromFile '${filterPath}'`, async () => {
		// Load filters
		const loadedFilters = await FilterFactory.getFromFile(filterPath);

		// Test content of transformed filters
		expect(loadedFilters).toHaveProperty('video');
		for (const filter of loadedFilters.video) {
			for (const condition of filter) {
				expect(condition).toBeInstanceOf(FilterCondition);
			}
		}
	});
});
