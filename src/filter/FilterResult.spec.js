const FilterResult = require('./FilterResult');
const FilterConditionResult = require('./FilterConditionResult');

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
