import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import mime from 'mime-types';

import { Directory, DirectoryData } from './Directory';
import { File, FileData } from './File';
import { SerializableData } from '../serializable/Serializable';

const statAsync = promisify(fs.stat);
const readdirAsync = promisify(fs.readdir);

export class FsTreeFactory {
	static async getTreeFromFileSystem(nodePath: string): Promise<File|Directory> {
		const stats = await statAsync(nodePath);

		if (stats.isFile()) {
			const mimeType = mime.lookup(nodePath) || 'application/octet-stream';
			const file = new File(nodePath, stats, mimeType);
			return file;
		}

		if (stats.isDirectory()) {
			const fileNames = await readdirAsync(nodePath);
			const children = await Promise.all(fileNames.map(fileName => {
				const childPath = path.join(nodePath, fileName);
				return FsTreeFactory.getTreeFromFileSystem(childPath);
			}));
			const directory = new Directory(nodePath, stats, children);
			return directory;
		}

		throw new Error(`FsTreeFactory cannot determine what this is: ${nodePath}`);
	}

	static getTreeFromSerialized(serialized: SerializableData): File|Directory {
		if (serialized.type === 'Directory') {
			const data = serialized as DirectoryData;
			const children = data.children.map(child => FsTreeFactory.getTreeFromSerialized(child));
			return new Directory(data.path, data.stats, children);
		}

		if (serialized.type === 'File') {
			const data = serialized as FileData;
			const file = new File(data.path, data.stats, data.mimeType);
			return file;
		}

		throw new Error(`FsTreeFactory cannot determine what this is: ${serialized.type}`);
	}
}
