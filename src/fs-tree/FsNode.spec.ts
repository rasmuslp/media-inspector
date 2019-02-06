import path from 'path';

import { FsNode } from './FsNode';
import {Serialized} from './Serialized';

class FsNodeImpl extends FsNode {
	// @ts-ignore TODO Handle better
	serialize() {}
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
