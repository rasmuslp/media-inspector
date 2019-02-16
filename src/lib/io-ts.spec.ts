import * as t from 'io-ts';

import { decodeTo, decodeToPromise } from './io-ts';

describe('io-ts', () => {
	const RuleDataValidator = t.type({
		mimeType: t.string
	});

	test('it validates rule with #decodeToPromise', async () => {
		const ruleData = {
			mimeType: 'video'
		};

		await decodeToPromise(RuleDataValidator, ruleData);
	});

	test('it validates rule with #decodeTo', () => {
		const ruleData = {
			mimeType: 'video'
		};

		decodeTo(RuleDataValidator, ruleData);
	});
});
