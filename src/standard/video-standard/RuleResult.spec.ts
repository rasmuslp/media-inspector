import { ConditionAnalyzer } from '../../analyzer/condition/ConditionAnalyzer';
import { IConditionResult } from '../../analyzer/interfaces/IConditionResult';
import { Equal } from '../condition/types/Equal';
import { GreaterThanOrEqual } from '../condition/types/GreaterThanOrEqual';
import { RuleResult } from './RuleResult';

const conditionAnalyzer = new ConditionAnalyzer();

describe('#satisfied', () => {
	let failed1: IConditionResult;
	let failed2: IConditionResult;
	let satisfied1: IConditionResult;
	let satisfied2: IConditionResult;
	beforeEach(() => {
		const condition = new Equal('dummy', 'yesyes');
		failed1 = conditionAnalyzer.analyze(condition, 'nono');
		failed2 = conditionAnalyzer.analyze(condition, 'nono');
		satisfied1 = conditionAnalyzer.analyze(condition, 'yesyes');
		satisfied2 = conditionAnalyzer.analyze(condition, 'yesyes');
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
		const condition = new GreaterThanOrEqual('video.framerate', 25);
		const result = conditionAnalyzer.analyze(condition, '25');

		const ruleResult = new RuleResult([result]);
		const resultAsStrings = ruleResult.getResultsAsStrings();

		// Test
		expect(resultAsStrings).toHaveLength(1);
		expect(resultAsStrings[0]).toMatch(/satisfied/);
	});

	test('that string reports as failed for failed checks', () => {
		const condition = new GreaterThanOrEqual('audio.channels', 2);
		const result = conditionAnalyzer.analyze(condition, '1');

		const ruleResult = new RuleResult([result]);
		const resultAsStrings = ruleResult.getResultsAsStrings();

		// Test
		expect(resultAsStrings).toHaveLength(1);
		expect(resultAsStrings[0]).toMatch(/failed/);
	});
});
