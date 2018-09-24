const path = require('path');

const commander = require('commander');
const mime = require('mime-types');

const fsTree = require('./fs-tree');

const packageJson = require(path.join(__dirname, '..', 'package.json'));

commander
	.version(packageJson.version)
	.option('-n, --dry-run', `Don't actually perform any actions`)
	.parse(process.argv);

const directories = commander.args;
if (!(directories.length)) {
	console.error('media-pruner needs to know where to scan');
}

async function run(directoryPath) {
	console.log(`media-pruner scanning ${directoryPath}`);

	const dir = await fsTree(directoryPath);
	console.log('Dir:', dir);

	const jsonFiles = await dir.findInTree(node => {
		const mimeType = mime.lookup(node.path);
		if (mimeType) {
			return mimeType === 'application/json';
		}

		return false;
	});
	console.log('JSON:', jsonFiles);

	const size = await dir.getSizeOfTree();
	console.log('Size: ', size);
}

run(directories[0]);

