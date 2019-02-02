import { FilterConditionFactory } from './filter-conditions/FilterConditionFactory';
import { FilterConditionResult } from './FilterConditionResult';

import { FilterResult } from './FilterResult';

describe('#passed', () => {
	let failed1;
	let failed2;
	let passed1;
	let passed2;
	beforeEach(() => {
		// @ts-ignore
		failed1 = new FilterConditionResult({ passed: false });
		// @ts-ignore
		failed2 = new FilterConditionResult({ passed: false });
		// @ts-ignore
		passed1 = new FilterConditionResult({ passed: true });
		// @ts-ignore
		passed2 = new FilterConditionResult({ passed: true });
	});

	test('passes on empty input', () => {
		const result = new FilterResult();
		expect(result.passed).toBe(true);
	});

	test('passes if all conditions passed', () => {
		const result = new FilterResult([passed1, passed2]);
		expect(result.passed).toBe(true);
	});

	test('fails if any condition failed', () => {
		const result = new FilterResult([failed1, failed2, passed1, passed2]);
		expect(result.passed).toBe(false);
	});
});

describe('one failed on passed', () => {
	let results;
	beforeEach(() => {
		const conditions = [
			FilterConditionFactory.createFilterCondition({
				path: 'video.framerate',
				operator: '>=',
				value: 25
			}),

			FilterConditionFactory.createFilterCondition({
				path: 'audio.channels',
				operator: '>=',
				value: 2
			})
		];

		results = [
			// Should pass
			conditions[0].check(25),

			// Should fail
			conditions[1].check(1)
		];

		// NB: Is it bad practice to check the test input here?
		// Check input
		expect(results[0].passed).toBe(true);
		expect(results[1].passed).toBe(false);
	});

	test('#getResultsAsStrings', () => {
		const filterResult = new FilterResult(results);
		const resultAsStrings = filterResult.getResultsAsStrings();

		// Test
		expect(resultAsStrings).toHaveLength(2);
		expect(resultAsStrings[0]).toMatch(/passed/);
		expect(resultAsStrings[1]).toMatch(/failed/);
	});

	test('#getWeightedScore', () => {
		const filterResult = new FilterResult(results);
		const score = filterResult.getWeightedScore();
		expect(score).toBe(4);
	});
});
