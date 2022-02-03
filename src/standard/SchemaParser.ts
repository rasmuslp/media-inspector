import { StandardDefinition, StandardSchema } from './schema/Standard';
import { ISchemaParser } from './ISchemaParser';

export class SchemaParser implements ISchemaParser {
	parse(data: unknown): StandardDefinition {
		const parsed = StandardSchema.parse(data);
		return parsed;
	}
}
