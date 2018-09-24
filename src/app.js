const fs = require('fs');
const path = require('path');
const util = require('util');

const commander = require('commander');
const mime = require('mime-types');

const Directory = require('./Directory');
const File = require('./File');

const packageJson = require(path.join(__dirname, '..', 'package.json'));

const statAsync = util.promisify(fs.stat);
const readdirAsync = util.promisify(fs.readdir);

commander
	.version(packageJson.version)
	.option('-n, --dey-run', `Don't actually perform any actions`)
	.parse(process.argv);

console.log('Commander', commander);
console.log('Args', process.argv);

async function buildNode(nodePath, DirectoryClass, FileClass) {
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

async function run() {
	const dir = await buildNode(path.join(__dirname, '..'), Directory, File);

	const jsonFiles = await dir.findInTree(node => {
		const mimeType = mime.lookup(node.path);
		if (mimeType) {
			return mimeType === 'application/json';
		}

		return false;
	});

	console.log('Dir:', dir);
	console.log('JSON:', jsonFiles);
}

run();
