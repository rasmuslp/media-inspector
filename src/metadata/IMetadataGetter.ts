import { Metadata } from './Metadata';

export interface IMetadataGetter {
	getMetadata(path: string): Metadata | undefined;
}
