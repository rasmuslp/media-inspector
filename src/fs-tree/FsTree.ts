import fs from 'fs';
import { promisify } from 'util';

import { FsNode } from './FsNode';
import { Directory } from './Directory';

import { DirectoryFactory } from './DirectoryFactory';
import { MediaFile } from './MediaFile';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export class FsTree {
	static async readFromFileSystem(nodePath: string): Promise<FsNode> {
		const node = await DirectoryFactory.getTreeFromFileSystem(nodePath);

		await FsTree.traverse(node, async node => {
			if (node instanceof MediaFile) {
				await node.readMetadataFromFileSystem();
			}
		});

		return node;
	}

	static async readFromSerialized(serializePath: string): Promise<FsNode> {
		const fileContent = await readFile(serializePath, 'utf8');
		const parsed = JSON.parse(fileContent);
		const node = await DirectoryFactory.getTreeFromSerialized(parsed.data);
		return node;
	}

	static async write(node: FsNode, writePath: string) {
		const serialized = {
			metadata: {
				createdAt: Date.now()
			},
			data: node.serialize()
		};
		const json = JSON.stringify(serialized, null, 4);

		return await writeFile(writePath, json, 'utf8');
	}

	static isSerializePath(serializePath: string) {
		return serializePath.endsWith('.json');
	}

	static async traverse(node: FsNode, nodeFn: Function) {
		await FsTree.traverseBfs(node, nodeFn);
	}

	static async traverseBfs(node: FsNode, nodeFn: Function) {
		const queue: [FsNode] = [node];
		while (queue.length) {
			// Get node
			const node = queue.shift();

			// Queue any children
			if (node.children.length > 0) {
				queue.push(...node.children);
			}

			// Apply fn
			await nodeFn(node);
		}
	}

	static async find(node: FsNode, matchFn: Function) {
		const matches = [];

		await FsTree.traverse(node, async node => {
			// Check match
			const match = await matchFn(node);
			if (match) {
				matches.push(node);
			}
		});

		return matches;
	}

	static async getSize(node: FsNode) {
		let sizes = [];

		await FsTree.traverse(node, node => sizes.push(node.size));

		return sizes.reduce((sum, cur) => sum + cur, 0);
	}

	// Returns list of tree, this included
	static async getAsList(node: FsNode): Promise<FsNode[]> {
		const nodes = [];
		await FsTree.traverse(node, node => {
			nodes.push(node);
		});

		return nodes;
	}

	static async getAsSortedList(node: FsNode): Promise<FsNode[]> {
		const tree = await FsTree.getAsList(node);
		let sorted = [...tree];
		sorted.sort(Directory.getSortFnByPathDirFile);

		return sorted;
	}
}
