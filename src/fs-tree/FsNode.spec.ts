import path from 'path';

import { FsNode } from './FsNode';

class FsNodeImpl extends FsNode {
	isDirectory(): boolean {
		throw new Error('Method not implemented.');
	}

	isFile(): boolean {
		throw new Error('Method not implemented.');
	}
}

describe('FsNode', () => {
	const pathTofsNode = path.join(__dirname, 'FsNode.js');
	const stats = {
		size: 0
	};

	let fsNode;
	beforeEach(() => {
		fsNode = new FsNodeImpl(pathTofsNode, stats);
	});

	test('path', () => {
		expect(fsNode.path).toBe(pathTofsNode);
	});

	test('size', () => {
		expect(fsNode.size).toBe(0);
	});
});
