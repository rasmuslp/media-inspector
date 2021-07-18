import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import mime from 'mime-types';

import { decodeTo } from '../lib/io-ts';
import { SerializableData } from '../serializable/Serializable';
import { Directory, TDirectory } from './Directory';
import { File, TFile } from './File';

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
			const data = decodeTo(TDirectory, serialized);
			const children = data.children.map(child => FsTreeFactory.getTreeFromSerialized(child));
			const directory = new Directory(data.path, data.stats, children);
			return directory;
		}

		if (serialized.type === 'File') {
			const data = decodeTo(TFile, serialized);
			const file = new File(data.path, data.stats, data.mimeType);
			return file;
		}

		throw new Error(`FsTreeFactory cannot determine what this is: ${serialized.type}`);
	}
}
