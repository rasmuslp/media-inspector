/* eslint-disable no-console,@typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function run() {
	const pJsonPath = path.resolve(__dirname, '..', 'package.json');

	const content = await readFile(pJsonPath, 'utf8');

	const searchPattern = /"commands": "\.\/src\/cli\/commands"/;
	const replacePattern = '"commands": "./dist/cli/commands"';

	if (!searchPattern.test(content)) {
		console.log(`Search pattern (${searchPattern.toString()}) not found!`);
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(-1);
	}

	const patchedContent = content.replace(searchPattern, replacePattern);

	await writeFile(pJsonPath, patchedContent);

	console.log('OK');
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void run();
