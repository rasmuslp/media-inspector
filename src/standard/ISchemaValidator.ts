import { StandardDefinition } from './schema/Standard';

export interface ISchemaValidator {
	validate(data: unknown): StandardDefinition
}
