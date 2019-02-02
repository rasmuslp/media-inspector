import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import mime from 'mime-types';

import { FsObject } from './FsObject';
import { Directory } from './Directory';
import { File } from './File';
import { VideoFile } from "./VideoFile";

import { MediainfoMetadataFactory } from './MediainfoMetadataFactory';

const statAsync = promisify(fs.stat);
const readdirAsync = promisify(fs.readdir);

export class FsTree {
	static async _directoryFactory(nodePath: string, stats): Promise<Directory> {
		const fileNames = await readdirAsync(nodePath);
		const children = await Promise.all(fileNames.map(fileName => {
			const childPath = path.join(nodePath, fileName);
			return FsTree.read(childPath);
		}));

		return new Directory(nodePath, stats, children);
	}

	static async _fileFactory(nodePath: string, stats): Promise<File> {
		const mimeType = mime.lookup(nodePath) || 'application/octet-stream';
		const type = File.getTypeFrom(mimeType);

		switch (type) {
			case 'video':
				const metadata = await MediainfoMetadataFactory.getFromFile(nodePath);
				return new VideoFile(nodePath, stats, mimeType, metadata);

			default:
				return new File(nodePath, stats, mimeType);
		}
	}

	// TODO: I could transform this to be based on FsTree.traverse
	static async read(nodePath: string): Promise<File|Directory> {
		const stats = await statAsync(nodePath);

		if (stats.isFile()) {
			const file = await FsTree._fileFactory(nodePath, stats);
			return file;
		}

		if (stats.isDirectory()) {
			const directory = await FsTree._directoryFactory(nodePath, stats);
			return directory;
		}

		throw new Error(`FsTree cannot determine is at ${nodePath}`);
	}

	static async traverse(node: FsObject, nodeFn: Function) {
		const queue: [FsObject] = [node];
		while (queue.length) {
			// Get node
			const node = queue.pop();

			// Queue any children
			if (node.children.length > 0) {
				queue.push(...node.children);
			}

			// Apply fn
			await nodeFn(node);
		}
	}

	static async find(node: FsObject, matchFn: Function) {
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

	static async getSize(node: FsObject) {
		let sizes = [];

		await FsTree.traverse(node,node => sizes.push(node.size));

		return sizes.reduce((sum, cur) => sum + cur, 0);
	}
}
