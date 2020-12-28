import fs from 'fs';
import { promisify } from 'util';

import { FsNode } from './FsNode';
import { Directory } from './Directory';

import { DirectoryFactory } from './DirectoryFactory';
import { MediaFile } from './MediaFile';
import { SerializableData } from './Serializable';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export class FsTree {
	static async getFromFileSystem(nodePath: string): Promise<FsNode> {
		const node = await DirectoryFactory.getTreeFromFileSystem(nodePath);

		await FsTree.traverse(node, async node => {
			if (node instanceof MediaFile) {
				await node.readMetadataFromFileSystem();
			}
		});

		return node;
	}

	static async getFromSerialized(serializePath: string): Promise<FsNode> {
		const fileContent = await readFile(serializePath, 'utf8');
		const parsed = JSON.parse(fileContent) as {data: SerializableData};
		const node = DirectoryFactory.getTreeFromSerialized(parsed.data);
		return node;
	}

	static async write(node: FsNode, writePath: string): Promise<void> {
		const serialized = {
			metadata: {
				createdAt: Date.now()
			},
			data: node.serialize()
		};
		const json = JSON.stringify(serialized, undefined, 4);

		return await writeFile(writePath, json, 'utf8');
	}

	static isSerializePath(serializePath: string): boolean {
		return serializePath.endsWith('.json');
	}

	static async traverse(node: FsNode, nodeFn: (node: FsNode) => Promise<void>): Promise<void> {
		await FsTree.traverseBfs(node, nodeFn);
	}

	static async traverseBfs(node: FsNode, nodeFn: (node: FsNode) => Promise<void>): Promise<void> {
		const queue: [FsNode] = [node];
		while (queue.length > 0) {
			// Get node
			const node = queue.shift();

			// Queue any children
			if (node.isDirectory()) {
				const directory = node as Directory;
				queue.push(...directory.children);
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
		sorted.sort(Directory.getSortFnByPathDirFile.bind(Directory));

		return sorted;
	}
}
