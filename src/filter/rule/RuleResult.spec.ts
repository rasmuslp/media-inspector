import { ConditionFactory } from './condition/ConditionFactory';

import { RuleResult } from './RuleResult';
import { ConditionOperator } from './condition/ConditionOperator';
import { ConditionResult } from './condition/ConditionResult';

describe('#satisfied', () => {
	let failed1: ConditionResult;
	let failed2: ConditionResult;
	let satisfied1: ConditionResult;
	let satisfied2: ConditionResult;
	beforeEach(() => {
		const condition = ConditionFactory.getFromSerialized({
			path: 'dummy',
			operator: ConditionOperator.EQUAL,
			value: 'yesyes'
		});
		failed1 = condition.check('nono');
		failed2 = condition.check('nono');
		satisfied1 = condition.check('yesyes');
		satisfied2 = condition.check('yesyes');
	});

	test('throws on empty input', () => {
		expect(() => {
			// eslint-disable-next-line no-new
			new RuleResult([]);
		}).toThrow();
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

describe('#getResultsAsStrings', () => {
	test('that string reports as satisfied for passed checks', () => {
		const condition = ConditionFactory.getFromSerialized({
			path: 'video.framerate',
			operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
			value: 25
		});
		const result = condition.check('25');

		const ruleResult = new RuleResult([result]);
		const resultAsStrings = ruleResult.getResultsAsStrings();

		// Test
		expect(resultAsStrings).toHaveLength(1);
		expect(resultAsStrings[0]).toMatch(/satisfied/);
	});

	test('that string reports as failed for failed checks', () => {
		const condition = ConditionFactory.getFromSerialized({
			path: 'audio.channels',
			operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
			value: 2
		});
		const result = condition.check('1');

		const ruleResult = new RuleResult([result]);
		const resultAsStrings = ruleResult.getResultsAsStrings();

		// Test
		expect(resultAsStrings).toHaveLength(1);
		expect(resultAsStrings[0]).toMatch(/failed/);
	});
});

describe('#getWeightedScore', () => {
	test('#1: Fail, #2: Pass --> 1', () => {
		const conditions = [
			ConditionFactory.getFromSerialized({
				path: 'video.framerate',
				operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
				value: 25
			}),

			ConditionFactory.getFromSerialized({
				path: 'audio.channels',
				operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
				value: 2
			})
		];

		const results = [
			conditions[0].check('23'),
			conditions[1].check('2')
		];

		const ruleResult = new RuleResult(results);
		const score = ruleResult.getWeightedScore();
		expect(score).toBe(1);
	});

	test('#1: Pass, #2: Fail --> 4', () => {
		const conditions = [
			ConditionFactory.getFromSerialized({
				path: 'video.framerate',
				operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
				value: 25
			}),

			ConditionFactory.getFromSerialized({
				path: 'audio.channels',
				operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
				value: 2
			})
		];

		const results = [
			conditions[0].check('25'),
			conditions[1].check('1')
		];

		const ruleResult = new RuleResult(results);
		const score = ruleResult.getWeightedScore();
		expect(score).toBe(4);
	});
});
