import { Rule } from './Rule';

describe('Rule', () => {
	it('throws Error if conditions array is empty', () => {
		expect(() => {
			// eslint-disable-next-line no-new
			new Rule('name', {}, 'type', []);
		}).toThrowError(/Rule requires at least 1 condition/);
	});
});
