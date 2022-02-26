import { IPrintable } from './IPrintable';
import { PrintableAuxiliaryResult } from './PrintableAuxiliaryResult';

describe('PrintableAuxiliaryResult', () => {
	let printableAuxiliaryResult: IPrintable;
	beforeEach(() => {
		printableAuxiliaryResult = new PrintableAuxiliaryResult('The message');
	});

	it('should return 1 plain string, describing the type and providing the message, provided no options', () => {
		const result = printableAuxiliaryResult.getStrings();
		expect(result).toStrictEqual([
			'[Auxiliary] The message'
		]);
	});

	it('should return 1 colorized string, describing the type and providing the message, provided options', () => {
		const result = printableAuxiliaryResult.getStrings({
			colorized: true
		});
		expect(result).toStrictEqual([
			'\u001B[33m[Auxiliary]\u001B[39m The message'
		]);
	});
});
