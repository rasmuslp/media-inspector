import { TestFsNode } from './FsNode.spec';
import { FsTree } from './FsTree';

function getFsTree(): { tree: FsTree, nodes: Record<string, TestFsNode> } {
	const nodes = {
		node0: new TestFsNode('/', {
			size: 10
		}),

		node1x1: new TestFsNode('/node1x1', {
			size: 20
		}),

		node1x2: new TestFsNode('/node1x2', {
			size: 30
		}),

		node2x1: new TestFsNode('/node1x2/node2x1', {
			size: 40
		})
	};

	const tree = new FsTree(nodes.node0);

	// Root to layer 1
	tree.addRelation(nodes.node0, nodes.node1x1);
	tree.addRelation(nodes.node0, nodes.node1x2);

	// Layer 1 to layer 2
	tree.addRelation(nodes.node1x2, nodes.node2x1);

	return {
		nodes,
		tree
	};
}

describe('FsTree', () => {
	describe('.getSize()', () => {
		describe('given getFsTree', () => {
			it('returns 100 for the root node', async () => {
				const { nodes, tree } = getFsTree();
				const size = await tree.getSize(nodes.node0);
				expect(size).toBe(100);
			});

			it('returns 70 for node1x2', async () => {
				const { nodes, tree } = getFsTree();
				const size = await tree.getSize(nodes.node1x2);
				expect(size).toBe(70);
			});
		});
	});
});
