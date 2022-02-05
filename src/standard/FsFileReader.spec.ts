import { FsFileReader } from './FsFileReader';

describe('FsFileReader', () => {
	it('should read this test suite', async () => {
		const reader = new FsFileReader();
		const result = await reader.read(__filename);
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
	});

	it('should throw error on non existing file', async () => {
		const reader = new FsFileReader();
		await expect(reader.read('nope-note-there')).rejects.toThrowError('Could not read file at \'nope-note-there\': ENOENT: no such file or directory, open \'nope-note-there\'');
	});
});
