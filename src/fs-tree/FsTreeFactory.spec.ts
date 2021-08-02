import { FsTreeFactory } from './FsTreeFactory';
import { FsNode } from './FsNode';
import { File } from './File';
import { Directory } from './Directory';
import { FsTree } from './FsTree';
import { SerializableSerialized } from '../serializable/Serializable';

class TestFsTreeFactory extends FsTreeFactory {
	static async getFsNodesFromFileSystem(nodePath: string): Promise<FsNode[]> {
		return super.getFsNodesFromFileSystem(nodePath);
	}

	static async getFsNodeFromFileSystem(nodePath: string): Promise<[File | Directory, string[]]> {
		return super.getFsNodeFromFileSystem(nodePath);
	}

	static getFsNodesFromSerialized(serializeds: SerializableSerialized[]): FsNode[] {
		return super.getFsNodesFromSerialized(serializeds);
	}

	static getFsNodeFromSerialized(serialized: SerializableSerialized): FsNode {
		return super.getFsNodeFromSerialized(serialized);
	}

	static buildFsTreeFromSortedFsNodes(sortedNodes: FsNode[]): FsTree {
		return super.buildFsTreeFromSortedFsNodes(sortedNodes);
	}
}

describe('FsTreeFactory', () => {
	describe('#getFsNodesFromSerialized()', () => {
		it('returns array of FsNode', () => {
			const serializeds = [{
				type: 'Directory',
				data: {
					path: '/',
					stats: { size: 1 }
				}
			}, {
				type: 'Directory',
				data: {
					path: '/folder',
					stats: { size: 2 }
				}
			}, {
				type: 'File',
				data: {
					path: '/x-file',
					stats: { size: 3 },
					mimeType: 'mime'
				}
			}];

			const result = TestFsTreeFactory.getFsNodesFromSerialized(serializeds);

			expect(result.length).toBe(3);

			expect(result[0]).toBeInstanceOf(Directory);
			expect(result[0].path).toBe('/');
			expect(result[0].size).toBe(1);

			expect(result[1]).toBeInstanceOf(Directory);
			expect(result[1].path).toBe('/folder');
			expect(result[1].size).toBe(2);

			expect(result[2]).toBeInstanceOf(File);
			expect(result[2].path).toBe('/x-file');
			expect(result[2].size).toBe(3);
			expect((result[2] as File).mimeType).toBe('mime');
		});
	});

	describe('#getFsNodeFromSerialized()', () => {
		it('returns a Directory', () => {
			const serialized = {
				type: 'Directory',
				data: {
					path: '/',
					stats: { size: 1 }
				}
			};

			const result = TestFsTreeFactory.getFsNodeFromSerialized(serialized);

			expect(result).toBeInstanceOf(Directory);
			expect(result.path).toBe('/');
			expect(result.size).toBe(1);
		});

		it('returns a File', () => {
			const serialized = {
				type: 'File',
				data: {
					path: '/x-file',
					stats: { size: 3 },
					mimeType: 'mime'
				}
			};

			const result = TestFsTreeFactory.getFsNodeFromSerialized(serialized);

			expect(result).toBeInstanceOf(File);
			expect(result.path).toBe('/x-file');
			expect(result.size).toBe(3);
			expect((result as File).mimeType).toBe('mime');
		});
	});

	describe('#buildFsTreeFromSortedFsNodes()', () => {
		let sortedFsNodes: FsNode[];
		beforeEach(() => {
			const stats = { size: 0 };
			sortedFsNodes = [];
			sortedFsNodes.push(
				new Directory('/', stats),
				new File('/a-file', stats, 'mime'),
				new File('/file1', stats, 'mime'),
				new Directory('/folder1', stats),
				new Directory('/folder1/folder2', stats),
				new File('/folder1/folder2/file1', stats, 'mime'),
				new File('/x-last-file', stats, 'mime')
			);
		});

		it('has correct root node', async () => {
			const rootNode = sortedFsNodes[0];
			const result = TestFsTreeFactory.buildFsTreeFromSortedFsNodes(sortedFsNodes);
			expect(result.root).toBe(rootNode);
		});

		it('root node has 4 children', async () => {
			const rootNode = sortedFsNodes[0];
			const result = TestFsTreeFactory.buildFsTreeFromSortedFsNodes(sortedFsNodes);
			const children = result.getDirectChildren(rootNode);
			expect(children).toContain(sortedFsNodes[1]);
			expect(children).toContain(sortedFsNodes[2]);
			expect(children).toContain(sortedFsNodes[3]);
			expect(children).toContain(sortedFsNodes[6]);
			expect(children.length).toBe(4);
		});

		it('/folder1 node has 1 child', async () => {
			const folder1Node = sortedFsNodes[3];
			const result = TestFsTreeFactory.buildFsTreeFromSortedFsNodes(sortedFsNodes);
			const children = result.getDirectChildren(folder1Node);
			const folder2Node = sortedFsNodes[4];
			expect(children).toContain(folder2Node);
			expect(children.length).toBe(1);
		});

		it('/folder1/folder2 node has 1 child', async () => {
			const folder2Node = sortedFsNodes[4];
			const result = TestFsTreeFactory.buildFsTreeFromSortedFsNodes(sortedFsNodes);
			const children = result.getDirectChildren(folder2Node);
			const folder2File1Node = sortedFsNodes[5];
			expect(children).toContain(folder2File1Node);
			expect(children.length).toBe(1);
		});
	});
});
