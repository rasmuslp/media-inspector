import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import {Directory} from './Directory';
import {FileFactory} from './FileFactory';
import {FsNode} from './FsNode';

const statAsync = promisify(fs.stat);
const readdirAsync = promisify(fs.readdir);

export class DirectoryFactory {
	static async getTreeFromPath(nodePath: string): Promise<FsNode> {
		return await DirectoryFactory._getFsNodeFromPath(nodePath);
	}

	static async createDirectoryFromPath(nodePath: string, stats): Promise<Directory> {
		const children = await DirectoryFactory._getChildrenFromPath(nodePath);

		return new Directory(nodePath, stats, children);
	}

	static async _getFsNodeFromPath(nodePath: string): Promise<FsNode> {
		const stats = await statAsync(nodePath);

		if (stats.isFile()) {
			const file = await FileFactory.createFileFrom(nodePath, stats);
			return file;
		}

		if (stats.isDirectory()) {
			const directory = await DirectoryFactory.createDirectoryFromPath(nodePath, stats);
			return directory;
		}

		throw new Error(`DirectoryFactory cannot determine what this is: ${nodePath}`);
	}

	static async _getChildrenFromPath(nodePath: string): Promise<(FsNode)[]> {
		const fileNames = await readdirAsync(nodePath);
		const children = await Promise.all(fileNames.map(fileName => {
			const childPath = path.join(nodePath, fileName);
			return DirectoryFactory._getFsNodeFromPath(childPath);
		}));

		return children;
	}
}
