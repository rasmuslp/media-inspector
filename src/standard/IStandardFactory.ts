import { StandardDefinition } from './schema/Standard';
import { Standard } from './Standard';

export interface IStandardFactory {
	create(definition: StandardDefinition): Standard
}
