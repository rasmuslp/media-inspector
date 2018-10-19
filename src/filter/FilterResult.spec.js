const FilterCondition = require('./FilterCondition');
const FilterConditionResult = require('./FilterConditionResult');

const FilterResult = require('./FilterResult');

describe('#passed', () => {
	let failed1;
	let failed2;
	let passed1;
	let passed2;
	beforeEach(() => {
		failed1 = new FilterConditionResult({ passed: false });
		failed2 = new FilterConditionResult({ passed: false });
		passed1 = new FilterConditionResult({ passed: true });
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

describe('#getResultsAsStrings', () => {
	test('one failed on passed', () => {
		const conditions = [
			new FilterCondition({
				path: 'video.framerate',
				comparator: '>=',
				value: 25
			}),

			new FilterCondition({
				path: 'audio.channels',
				comparator: '>=',
				value: 2
			})
		];

		const results = [
			// Should fail
			conditions[0].check(15),

			// Should pass
			conditions[1].check(2)
		];

		// Check input
		expect(results[0].passed).toBe(false);
		expect(results[1].passed).toBe(true);

		const filterResult = new FilterResult(results);
		const resultAsStrings = filterResult.getResultsAsStrings();

		// Test
		expect(resultAsStrings).toHaveLength(2);
		expect(resultAsStrings[0]).toMatch(/failed/);
		expect(resultAsStrings[1]).toMatch(/passed/);
	});
});
