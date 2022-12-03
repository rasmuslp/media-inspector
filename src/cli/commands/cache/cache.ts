import path from 'path';

import { CliUx, Flags } from '@oclif/core';

import BaseCommand from '../../BaseCommand';
import { readMetadataFromFileSystem } from '../../helpers/readMetadataFromFileSystem';
import { SerializableIO } from '../../../serializable/SerializableIO';

/**
 * @deprecated
 */
export default class Cache extends BaseCommand {
	static description = '[Depracated] Cache metadata for a directory structure as JSON';

	static flags = {
		read: Flags.string({
			char: 'r',
			description: 'Path of a directory or file to read',
			parse: async input => path.resolve(process.cwd(), input),
			required: true
		}),

		write: Flags.string({
			char: 'w',
			description: 'Path of where to write the metadata cache as JSON',
			parse: async input => path.resolve(process.cwd(), input),
			required: true
		})
	};

	static examples = [
		'$ media-inspector cache -r ~/Downloads -w downloads.json',
		'$ media-inspector cache -r ~/Downloads/file.ext -w file.json',
		'$ media-inspector cache -r /Users/username/Downloads -w ~/Desktop/downloads.json'
	];

	async run() {
		const { flags } = await this.parse(Cache);

		if (!SerializableIO.isSerializePath(flags.write)) {
			throw new Error('Write path should end with .json');
		}
		if (SerializableIO.isSerializePath(flags.read)) {
			throw new Error('Why would you read json just to write it again?! (」ﾟﾛﾟ)｣');
		}

		const metadataCache = await readMetadataFromFileSystem(flags.read, true);

		CliUx.ux.action.start(`Writing ${flags.write}`);
		await SerializableIO.write(metadataCache, flags.write);
		CliUx.ux.action.stop();
	}
}
