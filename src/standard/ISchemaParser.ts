import { StandardDefinition } from './StandardSchema';

export interface ISchemaParser {
	parse(data: unknown): StandardDefinition
}
