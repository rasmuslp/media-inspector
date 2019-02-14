import { FilterConditionFactory } from './filter-condition/FilterConditionFactory';

import { FilterRuleResult } from './FilterRuleResult';

describe('#satisfied', () => {
	let failed1;
	let failed2;
	let satisfied1;
	let satisfied2;
	beforeEach(() => {
		const filterCondition = FilterConditionFactory.createFilterCondition({
			path: 'dummy',
			operator: '=',
			value: 'yesyes'
		});
		failed1 = filterCondition.check('nono');
		failed2 = filterCondition.check('nono');
		satisfied1 = filterCondition.check('yesyes');
		satisfied2 = filterCondition.check('yesyes');
	});

	test('passes on empty input', () => {
		const result = new FilterRuleResult();
		expect(result.satisfied).toBe(true);
	});

	test('passes if all conditions are satisfied', () => {
		const result = new FilterRuleResult([satisfied1, satisfied2]);
		expect(result.satisfied).toBe(true);
	});

	test('fails if any condition failed', () => {
		const result = new FilterRuleResult([failed1, failed2, satisfied1, satisfied2]);
		expect(result.satisfied).toBe(false);
	});
});

describe('one failed on satisfied', () => {
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
		expect(results[0].satisfied).toBe(true);
		expect(results[1].satisfied).toBe(false);
	});

	test('#getResultsAsStrings', () => {
		const filterResult = new FilterRuleResult(results);
		const resultAsStrings = filterResult.getResultsAsStrings();

		// Test
		expect(resultAsStrings).toHaveLength(2);
		expect(resultAsStrings[0]).toMatch(/satisfied/);
		expect(resultAsStrings[1]).toMatch(/failed/);
	});

	test('#getWeightedScore', () => {
		const filterResult = new FilterRuleResult(results);
		const score = filterResult.getWeightedScore();
		expect(score).toBe(4);
	});
});
