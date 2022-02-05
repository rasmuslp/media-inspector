import fs from 'fs';
import { promisify } from 'util';

import { IFileReader } from './IFileReader';

const readFile = promisify(fs.readFile);

export class FsFileReader implements IFileReader {
	async read(path: string): Promise<string> {
		try {
			const fileContent = await readFile(path, 'utf8');
			return fileContent;
		}
		catch (error) {
			throw new Error(`Could not read file at '${path}': ${(error as Error).message}`);
		}
	}
}
