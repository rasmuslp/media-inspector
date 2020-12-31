import path from 'path';

import { flags } from '@oclif/command';
import cli from 'cli-ux';

import { FsTree } from '../../fs-tree';
import BaseCommand from '../BaseCommand';
import { defaultGetFromFileSystemOptions } from '../../fs-tree/FsTree';

export default class Cache extends BaseCommand {
	static description = 'Cache a directory structure as JSON'

	static flags = {
		read: flags.string({
			char: 'r',
			description: 'Path of a directory to read',
			parse: input => path.resolve(process.cwd(), input),
			required: true
		}),

		write: flags.string({
			char: 'w',
			description: 'Path of where to write the cache as JSON',
			parse: input => path.resolve(process.cwd(), input),
			required: true
		})
	}

	static examples = [
		'$ media-inspector cache -r ~/Downloads -w downloads.json',
		'$ media-inspector cache -r /Users/username/Downloads -w ~/Desktop/downloads.json'
	]

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	async run() {
		const { flags } = this.parse(Cache);

		if (FsTree.isSerializePath(flags.read)) {
			throw new Error('Why would you read json just to write it again?! (」ﾟﾛﾟ)｣');
		}
		if (!FsTree.isSerializePath(flags.write)) {
			throw new Error('Write path should end with .json');
		}

		cli.log(`Reading from file system ${flags.read}`);
		const metadataProgressBar = cli.progress({
			format: 'Reading metadata | {bar} | {value}/{total} Files',
			barCompleteChar: '\u2588',
			barIncompleteChar: '\u2591'
		});
		const node = await FsTree.getFromFileSystem(flags.read, {
			...defaultGetFromFileSystemOptions,
			metadataTotalFn: (total: number) => metadataProgressBar.start(total),
			metadataIncrementFn: () => metadataProgressBar.increment()

		});
		metadataProgressBar.stop();

		cli.action.start(`Writing ${flags.write}`);
		await FsTree.write(node, flags.write);
		cli.action.stop();
	}
}
