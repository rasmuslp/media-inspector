import { ISchemaParser } from './ISchemaParser';
import { StandardDefinition, StandardSchema } from './StandardSchema';

export class SchemaParser implements ISchemaParser {
	parse(data: unknown): StandardDefinition {
		const parsed = StandardSchema.parse(data);
		return parsed;
	}
}
