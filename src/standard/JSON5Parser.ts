import JSON5 from 'json5';

import { IJSON5Parser } from './IJSON5Parser';

export class JSON5Parser implements IJSON5Parser {
	parse(text: string): unknown {
		try {
			const parsed = JSON5.parse<unknown>(text);
			return parsed;
		}
		catch (error) {
			throw new Error(`Could not parse JSON5 format: ${(error as Error).message}`);
		}
	}
}
