import { ux } from '@oclif/core';

import { IFileReader } from '../../standard/IFileReader';
import { IJSON5Parser } from '../../standard/IJSON5Parser';
import { ISchemaParser } from '../../standard/ISchemaParser';
import { IStandardFactory } from '../../standard/IStandardFactory';
import { Standard } from '../../standard/Standard';
import { IStandardReader } from './IStandardReader';

export class StandardReader implements IStandardReader {
	private readonly fileReader: IFileReader;

	private readonly json5Parser: IJSON5Parser;

	private readonly schemaParser: ISchemaParser;

	private readonly standardFactory: IStandardFactory;

	constructor(fileReader: IFileReader, json5Parser: IJSON5Parser, schemaParser: ISchemaParser, standardFactory: IStandardFactory) {
		this.fileReader = fileReader;
		this.json5Parser = json5Parser;
		this.schemaParser = schemaParser;
		this.standardFactory = standardFactory;
	}

	public async read(path: string, verbose = false): Promise<Standard> {
		if (verbose) {
			ux.action.start(`Reading from: ${path}`);
		}
		const fileContent = await this.fileReader.read(path);
		if (verbose) {
			ux.action.stop();
		}

		if (verbose) {
			ux.action.start('Parsing JSON');
		}
		const parsedJson = await this.json5Parser.parse(fileContent);
		if (verbose) {
			ux.action.stop();
		}

		if (verbose) {
			ux.action.start('Validating standard definition');
		}
		const parsedSchema = this.schemaParser.parse(parsedJson);
		if (verbose) {
			ux.action.stop();
		}

		if (verbose) {
			ux.action.start('Creating standard');
		}
		const standard = this.standardFactory.create(parsedSchema);
		if (verbose) {
			ux.action.stop();
		}

		return standard;
	}
}
