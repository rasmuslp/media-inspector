import { File } from './File';

describe('File', () => {
	let file: File;
	beforeEach(() => {
		file = new File('/dummy/path', { size: 1 }, 'video/mp4');
	});

	test('getMimeTypeWithoutSubtype return only the main type of the mimeType', () => {
		const type = file.getMimeTypeWithoutSubtype();
		expect(type).toBe('video');
	});
});
