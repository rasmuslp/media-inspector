import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { Directory, SerializedDirectoryData } from './Directory';
import { FileFactory } from './FileFactory';
import { FsNode, SerializedFsNodeData } from './FsNode';
import { Serialized } from './Serialized';

const statAsync = promisify(fs.stat);
const readdirAsync = promisify(fs.readdir);

export class DirectoryFactory {
	static async getTreeFromFileSystem(nodePath: string): Promise<FsNode> {
		return await DirectoryFactory._getFsNodeFromFileSystem(nodePath);
	}

	static async createDirectoryFromFileSystem(nodePath: string, stats): Promise<Directory> {
		const children = await DirectoryFactory._getChildrenFromFileSystem(nodePath);

		return new Directory(nodePath, stats, children);
	}

	static async _getFsNodeFromFileSystem(nodePath: string): Promise<FsNode> {
		const stats = await statAsync(nodePath);

		if (stats.isFile()) {
			const file = await FileFactory.createFileFrom(nodePath, stats);
			return file;
		}

		if (stats.isDirectory()) {
			const directory = await DirectoryFactory.createDirectoryFromFileSystem(nodePath, stats);
			return directory;
		}

		throw new Error(`DirectoryFactory cannot determine what this is: ${nodePath}`);
	}

	static async _getChildrenFromFileSystem(nodePath: string): Promise<(FsNode)[]> {
		const fileNames = await readdirAsync(nodePath);
		const children = await Promise.all(fileNames.map(fileName => {
			const childPath = path.join(nodePath, fileName);
			return DirectoryFactory._getFsNodeFromFileSystem(childPath);
		}));

		return children;
	}

	static getTreeFromSerialized(data: Serialized): FsNode {
		return DirectoryFactory._getFsNodeFromSerialized(data);
	}

	static _getFsNodeFromSerialized(data: Serialized): FsNode {
		switch (data.instance) {
			case 'Directory': {
				return DirectoryFactory.createFromSerialized(data);
			}

			case 'File':
			case 'VideoFile': {
				return FileFactory.createFromSerialized(data);
			}
		}
	}

	static createFromSerialized(serialized: Serialized): Directory {
		const data = serialized.data as SerializedDirectoryData;

		const children = DirectoryFactory._getChildrenFromSerialized(data.children);

		return new Directory(data.path, data.stats, children);
	}

	static _getChildrenFromSerialized(serializedChildren: Serialized<SerializedFsNodeData>[]): FsNode[] {
		const children = serializedChildren.map(child => DirectoryFactory._getFsNodeFromSerialized(child));
		return children;
	}
}
