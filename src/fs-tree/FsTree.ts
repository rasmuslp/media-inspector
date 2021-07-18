import { FsNode } from './FsNode';
import { Directory } from './Directory';
import { PathSorters } from './PathSorters';

export class FsTree {
	static async traverse(node: FsNode, nodeFn: (node: FsNode) => Promise<void>): Promise<void> {
		await FsTree.traverseBfs(node, nodeFn);
	}

	static async traverseBfs(node: FsNode, nodeFn: (node: FsNode) => Promise<void>): Promise<void> {
		const queue: [FsNode] = [node];
		while (queue.length > 0) {
			// Get node
			const node = queue.shift();

			// Queue any children
			if (node instanceof Directory) {
				queue.push(...node.children);
			}

			// Apply fn
			await nodeFn(node);
		}
	}

	static async find(node: FsNode, matchFn: (node: FsNode) => Promise<boolean>): Promise<FsNode[]> {
		const matches: FsNode[] = [];

		await FsTree.traverse(node, async node => {
			// Check match
			const match = await matchFn(node);
			if (match) {
				matches.push(node);
			}
		});

		return matches;
	}

	static async getSize(node: FsNode): Promise<number> {
		const sizes: number[] = [];

		await FsTree.traverse(node, node => void sizes.push(node.size));

		let totalSize = 0;
		for (const size of sizes) {
			totalSize += size;
		}

		return totalSize;
	}

	// Returns list of tree, this included
	static async getAsList(node: FsNode): Promise<FsNode[]> {
		const nodes: FsNode[] = [];

		await FsTree.traverse(node, node => void nodes.push(node));

		return nodes;
	}

	static async getAsSortedList(node: FsNode): Promise<FsNode[]> {
		const tree = await FsTree.getAsList(node);
		const sorted = [...tree];
		sorted.sort((a, b) => PathSorters.childrenBeforeParents(a.path, b.path));

		return sorted;
	}
}
