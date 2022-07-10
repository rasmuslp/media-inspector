import { PrintableOptions } from './PrintableOptions';

export interface IPrintable {
	getStrings(options?: PrintableOptions): string[]
}
