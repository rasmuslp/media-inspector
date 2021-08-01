import path from 'path';

import { flags } from '@oclif/command';
import cli from 'cli-ux';

import BaseCommand from '../BaseCommand';
import { readMetadataFromFileSystem } from '../helpers/readMetadataFromFileSystem';
import { SerializableIO } from '../../serializable/SerializableIO';

export default class Cache extends BaseCommand {
	static description = 'Cache metadata for a directory structure as JSON'

	static flags = {
		read: flags.string({
			char: 'r',
			description: 'Path of a directory to read',
			parse: input => path.resolve(process.cwd(), input),
			required: true
		}),

		write: flags.string({
			char: 'w',
			description: 'Path of where to write the metadata cache as JSON',
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

		if (!SerializableIO.isSerializePath(flags.write)) {
			throw new Error('Write path should end with .json');
		}
		if (SerializableIO.isSerializePath(flags.read)) {
			throw new Error('Why would you read json just to write it again?! (」ﾟﾛﾟ)｣');
		}

		const metadataCache = await readMetadataFromFileSystem(flags.read, true);

		cli.action.start(`Writing ${flags.write}`);
		await SerializableIO.write(metadataCache, flags.write);
		cli.action.stop();
	}
}
