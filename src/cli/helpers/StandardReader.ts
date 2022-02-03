import cli from 'cli-ux';

import { IFileReader } from '../../standard/IFileReader';
import { IJSON5Parser } from '../../standard/IJSON5Parser';
import { ISchemaParser } from '../../standard/ISchemaParser';

export class StandardReader {
	private readonly fileReader: IFileReader;

	private readonly json5Parser: IJSON5Parser;

	private readonly schemaParser: ISchemaParser;

	constructor(fileReader: IFileReader, json5Parser: IJSON5Parser, schemaParser: ISchemaParser) {
		this.fileReader = fileReader;
		this.json5Parser = json5Parser;
		this.schemaParser = schemaParser;
	}

	// TODO: Add return type
	public async read(path: string, verbose = false) {
		if (verbose) {
			cli.action.start(`Reading from: ${path}`);
		}
		const fileContent = await this.fileReader.read(path);
		if (verbose) {
			cli.action.stop();
		}

		if (verbose) {
			cli.action.start('Parsing JSON');
		}
		const parsedJson = await this.json5Parser.parse(fileContent);
		if (verbose) {
			cli.action.stop();
		}

		if (verbose) {
			cli.action.start('Validating standard definition');
		}
		const parsedSchema = this.schemaParser.parse(parsedJson);
		if (verbose) {
			cli.action.stop();
		}

		if (verbose) {
			cli.action.start('Creating standard');
		}
		if (verbose) {
			cli.action.stop();
		}

		return parsedSchema;
	}
}
