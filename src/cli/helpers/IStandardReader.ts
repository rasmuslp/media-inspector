import { Standard } from '../../standard/Standard';

export interface IStandardReader {
	read(path: string, verbose: boolean): Promise<Standard>;
}
