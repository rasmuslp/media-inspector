const fs = require('fs');
const path = require('path');
const util = require('util');

const statAsync = util.promisify(fs.stat);
const readdirAsync = util.promisify(fs.readdir);

const Directory = require('./Directory');
const File = require('./File');

async function buildNode(nodePath, DirectoryClass = Directory, FileClass = File) {
	const stats = await statAsync(nodePath);

	if (stats.isFile()) {
		const file = new FileClass(nodePath, stats);
		return file;
	}

	if (stats.isDirectory()) {
		let children = await readdirAsync(nodePath);
		children = await Promise.all(children.map(async name => {
			const childPath = path.join(nodePath, name);
			return buildNode(childPath, DirectoryClass, FileClass);
		}));

		const directory = new DirectoryClass(nodePath, stats, children);
		return directory;
	}

	throw new Error('WAT?!');
}

module.exports = async function fsTree(nodePath, DirectoryClass, FileClass) {
	return buildNode(nodePath, DirectoryClass, FileClass)
};
