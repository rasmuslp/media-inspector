import path from 'path';

import { FsNode, FsNodeSerialized } from './FsNode';

// eslint-disable-next-line jest/no-export
export class TestFsNode extends FsNode {
	getDataForSerialization(): FsNodeSerialized {
		return {
			path: this.path,
			stats: this.stats
		};
	}
}

describe('FsNode', () => {
	const pathToFsNode = path.join(__dirname, 'FsNode.js');
	const stats = {
		size: 123
	};

	let fsNode: FsNode;
	beforeEach(() => {
		fsNode = new TestFsNode(pathToFsNode, stats);
	});

	test('path', () => {
		expect(fsNode.path).toBe(pathToFsNode);
	});

	test('size', () => {
		expect(fsNode.size).toBe(123);
	});
});
