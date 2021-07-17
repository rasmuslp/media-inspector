import createDebug from 'debug';
import pLimit from 'p-limit';

import { FsNode } from './FsNode';
import { Directory } from './Directory';
import { DirectoryFactory } from './DirectoryFactory';
import { MediaFile } from './MediaFile';

import { Serializable } from '../serializable/Serializable';

const debug = createDebug('FsTree');

export interface getFromFileSystemOptions {
	metadataConcurrency: number;
	metadataTotalFn: (number) => void;
	metadataIncrementFn: () => void;
}

export const defaultGetFromFileSystemOptions: getFromFileSystemOptions = {
	metadataConcurrency: 10,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	metadataTotalFn: () => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	metadataIncrementFn: () => {}
};

export class FsTree {
	static async getFromFileSystem(nodePath: string, options = defaultGetFromFileSystemOptions): Promise<FsNode> {
		debug('getFromFileSystem: Scanning filesystem path %s, with options %j', nodePath, options);
		const node = await DirectoryFactory.getTreeFromFileSystem(nodePath);
		const nodes = await FsTree.getAsList(node);
		const mediaFiles: MediaFile[] = nodes.filter(node => node instanceof MediaFile).map(node => node as MediaFile);
		options.metadataTotalFn(mediaFiles.length);
		debug('getFromFileSystem: Found %d nodes', nodes.length);
		debug('getFromFileSystem: Found %d media files', mediaFiles.length);

		debug('getFromFileSystem: Reading metadata from %d files', mediaFiles.length);
		const limiter = pLimit(options.metadataConcurrency);
		const promises = mediaFiles.map(mediaFile => limiter(() => mediaFile.readMetadataFromFileSystem().finally(options.metadataIncrementFn)));
		await Promise.all(promises);

		debug('getFromFileSystem done');

		return node;
	}

	static async getFromSerialized(serializePath: string): Promise<FsNode> {
		const parsed = await Serializable.read(serializePath);
		const node = DirectoryFactory.getTreeFromSerialized(parsed.data);
		return node;
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
		sorted.sort(Directory.getSortFnByPathDirFile.bind(Directory));

		return sorted;
	}
}
