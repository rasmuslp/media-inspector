import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const statAsync = promisify(fs.stat);
const readdirAsync = promisify(fs.readdir);

import { Directory } from './Directory';
import { File } from './File';

import { RecommendedPurge } from './RecommendedPurge';

function defaultDirectoryBuilder(objectPath, stats, children) {
	return new Directory(objectPath, stats, children);
}

function defaultFileBuilder(objectPath, stats) {
	return new File(objectPath, stats);
}

async function buildNode(nodePath, directoryBuilder = defaultDirectoryBuilder, fileBuilder = defaultFileBuilder) {
	const stats = await statAsync(nodePath);

	if (stats.isFile()) {
		const file = fileBuilder(nodePath, stats);
		return file;
	}

	if (stats.isDirectory()) {
		const fileNames = await readdirAsync(nodePath);
		const children = await Promise.all(fileNames.map(fileName => {
			const childPath = path.join(nodePath, fileName);
			return buildNode(childPath, directoryBuilder, fileBuilder);
		}));

		const directory = directoryBuilder(nodePath, stats, children);
		return directory;
	}

	throw new Error('WAT?!');
}

export {
	Directory,
	File,

	RecommendedPurge,

	buildNode as buildTree
};
