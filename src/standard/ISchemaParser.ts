import { StandardDefinition } from './schema/Standard';

export interface ISchemaParser {
	parse(data: unknown): StandardDefinition
}
