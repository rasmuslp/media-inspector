import path from 'path';

import { FsFileReader } from './FsFileReader';
import { JSON5Parser } from './JSON5Parser';
import { SchemaParser } from './SchemaParser';

describe('SchemaParser', () => {
	describe('.validate - for examples/standard-default.json5', () => {
		let content : unknown;
		beforeEach(async () => {
			const fsFileReader = new FsFileReader();
			const json5Parser = new JSON5Parser();

			const fileContent = await fsFileReader.read(path.join(__dirname, '../../examples/standard-default.json5'));
			content = json5Parser.parse(fileContent);
		});

		it('should validate', async () => {
			const schemaParser = new SchemaParser();
			const result = schemaParser.validate(content);
			expect(result).toBeDefined();
		});
	});
});
