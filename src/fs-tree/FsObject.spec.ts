import path from 'path';

import { FsObject } from './FsObject';

class FsObjectImpl extends FsObject {}

describe('FsObject', () => {
	const pathToFsObject = path.join(__dirname, 'FsObject.js');
	const stats = {
		size: 0
	};

	let fsObject;
	beforeEach(() => {
		fsObject = new FsObjectImpl(pathToFsObject, stats);
	});

	test('path', () => {
		expect(fsObject.path).toBe(pathToFsObject);
	});

	test('size', () => {
		expect(fsObject.size).toBe(0);
	});
});
