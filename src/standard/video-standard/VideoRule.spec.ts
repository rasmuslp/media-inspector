import { VideoRule } from './VideoRule';

describe('VideoRule', () => {
	it('throws Error if conditions array is empty', () => {
		expect(() => {
			// eslint-disable-next-line no-new
			new VideoRule('name', {}, 'type', []);
		}).toThrow(/VideoRule requires at least 1 condition/);
	});
});
