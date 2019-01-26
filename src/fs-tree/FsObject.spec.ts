import path from 'path';

const { FsObject } = require('./FsObject');

describe('FsObject', () => {
	const pathToFsObject = path.join(__dirname, 'FsObject.js');
	const stats = {
		size: 0
	};

	let fsObject;
	beforeEach(() => {
		fsObject = new FsObject(pathToFsObject, stats);
	});

	test('path', () => {
		expect(fsObject.path).toBe(pathToFsObject);
	});

	test('size', () => {
		expect(fsObject.size).toBe(0);
	});
});
