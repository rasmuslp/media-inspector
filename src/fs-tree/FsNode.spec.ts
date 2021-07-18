import path from 'path';

import { FsNode } from './FsNode';

class FsNodeImpl extends FsNode {}

describe('FsNode', () => {
	const pathToFsNode = path.join(__dirname, 'FsNode.js');
	const stats = {
		size: 123
	};

	let fsNode: FsNode;
	beforeEach(() => {
		fsNode = new FsNodeImpl(pathToFsNode, stats);
	});

	test('path', () => {
		expect(fsNode.path).toBe(pathToFsNode);
	});

	test('size', () => {
		expect(fsNode.size).toBe(123);
	});
});
