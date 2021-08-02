import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import mime from 'mime-types';

import { Directory, DirectorySchema } from './Directory';
import { File, FileSchema } from './File';
import { FsTree } from './FsTree';
import { FsNode } from './FsNode';
import { PathSorters } from './PathSorters';
import { SerializableSerialized } from '../serializable/Serializable';
import { TreeSchema } from './Tree';

const statAsync = promisify(fs.stat);
const readdirAsync = promisify(fs.readdir);

export class FsTreeFactory {
	static async getTreeFromFileSystem(nodePath: string): Promise<FsTree> {
		const nodes = await FsTreeFactory.getFsNodesFromFileSystem(nodePath);
		const sortedNodes = [...nodes].sort((a, b) => PathSorters.parentsBeforeChildren(a.path, b.path));
		const fsTree = FsTreeFactory.buildFsTreeFromSortedFsNodes(sortedNodes);
		return fsTree;
	}

	protected static async getFsNodesFromFileSystem(nodePath: string): Promise<FsNode[]> {
		const fsNodes: FsNode[] = [];
		const queue: string[] = [nodePath];

		while (queue.length > 0) {
			const itemPath = queue.shift()!;

			const [fsNode, childPaths] = await FsTreeFactory.getFsNodeFromFileSystem(itemPath);
			fsNodes.push(fsNode);
			queue.push(...childPaths);
		}

		return fsNodes;
	}

	protected static async getFsNodeFromFileSystem(nodePath: string): Promise<[File | Directory, string[]]> {
		const stats = await statAsync(nodePath);

		if (stats.isDirectory()) {
			const fileNames = await readdirAsync(nodePath);
			const childPaths = fileNames.map(fileName => path.join(nodePath, fileName));
			const directory = new Directory(nodePath, stats);
			return [directory, childPaths];
		}

		if (stats.isFile()) {
			const mimeType = mime.lookup(nodePath) || 'application/octet-stream';
			const file = new File(nodePath, stats, mimeType);
			return [file, []];
		}

		throw new Error(`FsTreeFactory cannot determine what this is: ${nodePath}`);
	}

	static getTreeFromSerialized(serialized: SerializableSerialized): FsTree {
		if (serialized.type === 'FsTree') {
			const parsed = TreeSchema.parse(serialized.data);
			const nodes = FsTreeFactory.getFsNodesFromSerialized(parsed.nodes);
			const sortedNodes = [...nodes].sort((a, b) => PathSorters.parentsBeforeChildren(a.path, b.path));
			const fsTree = FsTreeFactory.buildFsTreeFromSortedFsNodes(sortedNodes);
			return fsTree;
		}

		throw new Error(`FsTreeFactory cannot determine what this is: ${serialized.type}`);
	}

	protected static getFsNodesFromSerialized(serializeds: SerializableSerialized[]): FsNode[] {
		const nodes: FsNode[] = [];
		for (const serialized of serializeds) {
			const fsNode = FsTreeFactory.getFsNodeFromSerialized(serialized);
			nodes.push(fsNode);
		}

		return nodes;
	}

	protected static getFsNodeFromSerialized(serialized: SerializableSerialized): File | Directory {
		if (serialized.type === 'Directory') {
			const parsed = DirectorySchema.parse(serialized.data);
			const directory = new Directory(parsed.path, parsed.stats);
			return directory;
		}

		if (serialized.type === 'File') {
			const parsed = FileSchema.parse(serialized.data);
			const file = new File(parsed.path, parsed.stats, parsed.mimeType);
			return file;
		}

		throw new Error(`FsTreeFactory cannot determine what this is: ${serialized.type}`);
	}

	/**
	 *
	 * @param sortedNodes Sorted so that parents comes before any children.
	 * @protected
	 */
	protected static buildFsTreeFromSortedFsNodes(sortedNodes: FsNode[]): FsTree {
		if (sortedNodes.length === 0) {
			throw new Error('A FsTree requires an array with at least one');
		}

		const rootNode = sortedNodes[0];
		const fsTree = new FsTree(rootNode);

		const queue = sortedNodes.slice(1);
		const parentNodesStack: FsNode[] = [rootNode];
		while (queue.length > 0) {
			const node = queue.shift();

			let headIsAValidPrefixForChild: boolean;
			do {
				const [head] = parentNodesStack.slice(-1);
				headIsAValidPrefixForChild = node.path.startsWith(head.path);
				if (!headIsAValidPrefixForChild) {
					parentNodesStack.pop();
				}
			}
			while (!headIsAValidPrefixForChild);

			const [currentParentNode] = parentNodesStack.slice(-1);
			fsTree.addRelation(currentParentNode, node);

			if (node instanceof Directory) {
				parentNodesStack.push(node);
			}
		}

		return fsTree;
	}
}
