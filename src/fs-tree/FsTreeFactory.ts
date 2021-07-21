import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import mime from 'mime-types';

import { Directory, DirectorySchema } from './Directory';
import { File, FileSchema } from './File';
import { FsTree, FsTreeData } from './FsTree';
import { FsNode, FsNodeData } from './FsNode';
import { PathSorters } from './PathSorters';

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

	protected static async getFsNodeFromFileSystem(nodePath: string): Promise<[File|Directory, string[]]> {
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

	static getTreeFromSerialized(serialized: FsTreeData): FsTree {
		const nodes = FsTreeFactory.getFsNodesFromSerialized(serialized);
		const sortedNodes = [...nodes].sort((a, b) => PathSorters.parentsBeforeChildren(a.path, b.path));
		const fsTree = FsTreeFactory.buildFsTreeFromSortedFsNodes(sortedNodes);
		return fsTree;
	}

	protected static getFsNodesFromSerialized(serialized: FsTreeData): FsNode[] {
		const nodes: FsNode[] = [];
		for (const node of serialized.nodes) {
			const fsNode = FsTreeFactory.getFsNodeFromSerialized(node);
			nodes.push(fsNode);
		}

		return nodes;
	}

	protected static getFsNodeFromSerialized(serialized: FsNodeData): File|Directory {
		if (serialized.type === 'Directory') {
			const data = DirectorySchema.parse(serialized);
			const directory = new Directory(data.path, data.stats);
			return directory;
		}

		if (serialized.type === 'File') {
			const data = FileSchema.parse(serialized);
			const file = new File(data.path, data.stats, data.mimeType);
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
