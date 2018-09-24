const path = require('path');

const commander = require('commander');
const mime = require('mime-types');

const fsTree = require('./fs-tree');

const packageJson = require(path.join(__dirname, '..', 'package.json'));

commander
	.version(packageJson.version)
	.option('-n, --dey-run', `Don't actually perform any actions`)
	.parse(process.argv);

console.log('Commander', commander);
console.log('Args', process.argv);

async function run() {
	const dir = await fsTree(path.join(__dirname, '..'));

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
