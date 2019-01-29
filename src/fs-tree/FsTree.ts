import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import mime from 'mime-types';

import { Directory } from './Directory';
import { File } from './File';
import { FsObject } from './FsObject';

const statAsync = promisify(fs.stat);
const readdirAsync = promisify(fs.readdir);

export function defaultDirectoryBuilder(objectPath: string, stats, children: FsObject[]) {
	return new Directory(objectPath, stats, children);
}

export function defaultFileBuilder(objectPath: string, stats, mimeType: string) {
	return new File(objectPath, stats, mimeType);
}

export class FsTree {
	static async read(nodePath: string, directoryBuilder = defaultDirectoryBuilder, fileBuilder = defaultFileBuilder): Promise<File|Directory> {
		const stats = await statAsync(nodePath);

		if (stats.isFile()) {
			const mimeType = mime.lookup(nodePath);
			const file = fileBuilder(nodePath, stats, mimeType ? mimeType : undefined);
			return file;
		}

		if (stats.isDirectory()) {
			const fileNames = await readdirAsync(nodePath);
			const children = await Promise.all(fileNames.map(fileName => {
				const childPath = path.join(nodePath, fileName);
				return FsTree.read(childPath, directoryBuilder, fileBuilder);
			}));

			const directory = directoryBuilder(nodePath, stats, children);
			return directory;
		}

		throw new Error('WAT?!');
	}
}
