import { StandardDefinition, StandardSchema } from './schema/Standard';

export class SchemaParser {
	validate(data: unknown): StandardDefinition {
		const validated = StandardSchema.parse(data);
		return validated;
	}
}
