import { Standard } from './Standard';
import { StandardDefinition } from './StandardSchema';

export interface IStandardFactory {
	create(definition: StandardDefinition): Standard;
}
