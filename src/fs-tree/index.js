const fs = require('fs');
const path = require('path');
const util = require('util');

const statAsync = util.promisify(fs.stat);
const readdirAsync = util.promisify(fs.readdir);

const Directory = require('./Directory');
const File = require('./File');

const RecommendedPurge = require('./RecommendedPurge');

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
		let children = await readdirAsync(nodePath);
		children = await Promise.all(children.map(name => {
			const childPath = path.join(nodePath, name);
			return buildNode(childPath, directoryBuilder, fileBuilder);
		}));

		const directory = directoryBuilder(nodePath, stats, children);
		return directory;
	}

	throw new Error('WAT?!');
}

module.exports = {
	Directory,
	File,

	RecommendedPurge,

	build: buildNode
};
