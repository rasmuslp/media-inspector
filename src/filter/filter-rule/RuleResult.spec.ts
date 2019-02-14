import { ConditionFactory } from './condition/ConditionFactory';

import { RuleResult } from './RuleResult';

describe('#satisfied', () => {
	let failed1;
	let failed2;
	let satisfied1;
	let satisfied2;
	beforeEach(() => {
		const condition = ConditionFactory.createCondition({
			path: 'dummy',
			operator: '=',
			value: 'yesyes'
		});
		failed1 = condition.check('nono');
		failed2 = condition.check('nono');
		satisfied1 = condition.check('yesyes');
		satisfied2 = condition.check('yesyes');
	});

	test('passes on empty input', () => {
		const result = new RuleResult();
		expect(result.satisfied).toBe(true);
	});

	test('passes if all conditions are satisfied', () => {
		const result = new RuleResult([satisfied1, satisfied2]);
		expect(result.satisfied).toBe(true);
	});

	test('fails if any condition failed', () => {
		const result = new RuleResult([failed1, failed2, satisfied1, satisfied2]);
		expect(result.satisfied).toBe(false);
	});
});

describe('one failed on satisfied', () => {
	let results;
	beforeEach(() => {
		const conditions = [
			ConditionFactory.createCondition({
				path: 'video.framerate',
				operator: '>=',
				value: 25
			}),

			ConditionFactory.createCondition({
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
		const ruleResult = new RuleResult(results);
		const resultAsStrings = ruleResult.getResultsAsStrings();

		// Test
		expect(resultAsStrings).toHaveLength(2);
		expect(resultAsStrings[0]).toMatch(/satisfied/);
		expect(resultAsStrings[1]).toMatch(/failed/);
	});

	test('#getWeightedScore', () => {
		const ruleResult = new RuleResult(results);
		const score = ruleResult.getWeightedScore();
		expect(score).toBe(4);
	});
});
