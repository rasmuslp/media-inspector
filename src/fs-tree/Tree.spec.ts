import { Tree, TreeSerialized } from './Tree';
import { Serializable } from '../serializable/Serializable';

class TestNode extends Serializable<unknown> {
	public readonly id: string;

	constructor(id: string) {
		super();
		this.id = id;
	}

	getDataForSerialization(): void {}
}

const testNodeKeyMapper = (testNode: TestNode) => testNode.id;

class TestTree extends Tree<TestNode> {
	getNodes(): Map<string, TestNode> {
		return this.nodes;
	}

	getDataForSerialization(): TreeSerialized {
		return {
			nodes: this.getAsListSync().map(node => node.serialize())
		};
	}
}

function getTree(): { tree: TestTree, nodes: Record<string, TestNode> } {
	const nodes = {
		// Root node
		node0: new TestNode('node0'),

		// Layer 1
		node1x1: new TestNode('node1x1 match1'),
		node1x2: new TestNode('node1x2'), // Relations to 2x1, 2x2

		// Layer 2
		node2x1: new TestNode('node2x1 match1'), // Relation to 3x1
		node2x2: new TestNode('node2x2 match1'),

		// Layer 3
		node3x1: new TestNode('node3x1')
	};

	const tree = new TestTree(testNodeKeyMapper, nodes.node0);

	// Root to layer 1
	tree.addRelation(nodes.node0, nodes.node1x1);
	tree.addRelation(nodes.node0, nodes.node1x2);

	// Layer 1 to layer 2
	tree.addRelation(nodes.node1x2, nodes.node2x1);
	tree.addRelation(nodes.node1x2, nodes.node2x2);

	// Layer 2 to layer 3
	tree.addRelation(nodes.node2x1, nodes.node3x1);

	return {
		nodes,
		tree
	};
}

describe('Tree', () => {
	describe('.addRelation()', () => {
		let rootNode: TestNode;
		let tree: TestTree;
		beforeEach(() => {
			rootNode = new TestNode('root-id');
			tree = new TestTree(testNodeKeyMapper, rootNode);
		});

		// eslint-disable-next-line jest/expect-expect
		it('can add relation from root node to new node', () => {
			const newNode = new TestNode('new-id');
			tree.addRelation(rootNode, newNode);
		});

		it('fails to add relation from an unknown node - no unknown nodes', () => {
			const newNode = new TestNode('new-id');
			const anotherNode = new TestNode('another-id');
			expect(() => tree.addRelation(newNode, anotherNode)).toThrow(/fromNode is unknown/);
		});

		it('fails to add relation to a node twice - only one parent', () => {
			const newNode = new TestNode('another-id');
			tree.addRelation(rootNode, newNode);
			expect(() => tree.addRelation(rootNode, newNode)).toThrow(/toNode is not unique/);
		});
	});

	describe('.getDirectChildren()', () => {
		it('returns empty list of children, given an empty tree', () => {
			const rootNode = new TestNode('root');
			const tree = new TestTree(testNodeKeyMapper, rootNode);
			const children = tree.getDirectChildren(rootNode);
			expect(children.length).toBe(0);
		});

		describe('given getTree', () => {
			let nodes: Record<string, TestNode>;
			let tree: TestTree;
			beforeEach(() => {
				({ nodes, tree } = getTree());
			});

			it('returns list of children from root', () => {
				const children = tree.getDirectChildren(nodes.node0);
				expect(children).toContain(nodes.node1x1);
				expect(children).toContain(nodes.node1x2);
				expect(children.length).toBe(2);
			});

			it('returns empty list of children for node1x1 (leaf)', () => {
				const children = tree.getDirectChildren(nodes.node1x1);
				expect(children.length).toBe(0);
			});
		});
	});

	describe('.traverseBfs() callback', () => {
		it('only invokes once for root node, given an empty tree', async () => {
			const rootNode = new TestNode('root');
			const tree = new TestTree(testNodeKeyMapper, rootNode);
			const nodeFn = jest.fn();
			await tree.traverseBfs(nodeFn);
			expect(nodeFn).toHaveBeenCalledWith(rootNode);
			expect(nodeFn).toHaveBeenCalledTimes(1);
		});

		describe('given getTree', () => {
			let nodes: Record<string, TestNode>;
			let tree: TestTree;
			beforeEach(() => {
				({ nodes, tree } = getTree());
			});

			it('only invokes once for node1x1 (leaf)', async () => {
				const nodeFn = jest.fn();
				await tree.traverseBfs(nodeFn, nodes.node1x1);
				expect(nodeFn).toHaveBeenCalledWith(nodes.node1x1);
				expect(nodeFn).toHaveBeenCalledTimes(1);
			});

			it('invokes for node1x2 and all descendants', async () => {
				const nodeFn = jest.fn();
				await tree.traverseBfs(nodeFn, nodes.node1x2);
				expect(nodeFn).toHaveBeenNthCalledWith(1, nodes.node1x2);
				expect(nodeFn).toHaveBeenNthCalledWith(2, nodes.node2x1);
				expect(nodeFn).toHaveBeenNthCalledWith(3, nodes.node2x2);
				expect(nodeFn).toHaveBeenNthCalledWith(4, nodes.node3x1);
				expect(nodeFn).toHaveBeenCalledTimes(4);
			});

			it('invokes for root and all descendants', async () => {
				const nodeFn = jest.fn();
				await tree.traverseBfs(nodeFn);
				expect(nodeFn).toHaveBeenNthCalledWith(1, nodes.node0);
				expect(nodeFn).toHaveBeenNthCalledWith(2, nodes.node1x1);
				expect(nodeFn).toHaveBeenNthCalledWith(3, nodes.node1x2);
				expect(nodeFn).toHaveBeenNthCalledWith(4, nodes.node2x1);
				expect(nodeFn).toHaveBeenNthCalledWith(5, nodes.node2x2);
				expect(nodeFn).toHaveBeenNthCalledWith(6, nodes.node3x1);
				expect(nodeFn).toHaveBeenCalledTimes(tree.getNodes().size);
			});
		});
	});

	describe('.find()', () => {
		describe('given getTree', () => {
			let nodes: Record<string, TestNode>;
			let tree: TestTree;
			beforeEach(() => {
				({ nodes, tree } = getTree());
			});

			it('finds all nodes matching \'match1\'', async () => {
				const result = await tree.find(node => Promise.resolve(/match1/.test(node.id)));
				expect(result).toContain(nodes.node1x1);
				expect(result).toContain(nodes.node2x1);
				expect(result).toContain(nodes.node2x2);
				expect(result.length).toBe(3);
			});

			it('finds all nodes matching \'x1\' from node2x1', async () => {
				// eslint-disable-next-line unicorn/no-array-method-this-argument
				const result = await tree.find(node => Promise.resolve(/x1/.test(node.id)), nodes.node2x1);
				expect(result).toContain(nodes.node2x1);
				expect(result).toContain(nodes.node3x1);
				expect(result.length).toBe(2);
			});
		});
	});

	describe('.getAsList()', () => {
		it('returns root node, given an empty tree', async () => {
			const rootNode = new TestNode('root');
			const tree = new TestTree(testNodeKeyMapper, rootNode);
			const result = await tree.getAsList(rootNode);
			expect(result).toContain(rootNode);
		});

		describe('given getTree', () => {
			let nodes: Record<string, TestNode>;
			let tree: TestTree;
			beforeEach(() => {
				({ nodes, tree } = getTree());
			});

			it('returns node2x1 and all descendants', async () => {
				const result = await tree.getAsList(nodes.node2x1);
				expect(result).toContain(nodes.node2x1);
				expect(result).toContain(nodes.node3x1);
				expect(result.length).toBe(2);
			});

			it('returns the root node and all descendants', async () => {
				const result = await tree.getAsList(nodes.node0);
				expect(result).toContain(nodes.node0);
				expect(result).toContain(nodes.node1x1);
				expect(result).toContain(nodes.node1x2);
				expect(result).toContain(nodes.node2x1);
				expect(result).toContain(nodes.node2x2);
				expect(result).toContain(nodes.node3x1);
				expect(result.length).toBe(tree.getNodes().size);
			});
		});
	});
});
