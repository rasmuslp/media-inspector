import { IPrintable } from './IPrintable';
import { PrintableVideoResult } from './PrintableVideoResult';

describe('PrintableVideoResult', () => {
	describe('Satisfied VideoFileAnalysisResult', () => {
		let printableVideoResult: IPrintable;
		beforeEach(() => {
			printableVideoResult = new PrintableVideoResult({
				isSatisfied: true,
				videoRuleResults: [{
					name: 'Test 1',
					isSatisfied: true,
					conditionResults: [{
						isSatisfied: true,
						getResultAsString: () => 'string 1'
					}]
				}, {
					name: 'Test 2',
					isSatisfied: true,
					conditionResults: [{
						isSatisfied: true,
						getResultAsString: () => 'string 2'
					}]
				}]
			});
		});

		it('should return plain strings, describing the title and rule results, provided no options', () => {
			const result = printableVideoResult.getStrings();
			expect(result).toStrictEqual([
				'[Video] File satisfies standard',
				"Rule 'Test 1' satisfied: string 1",
				"Rule 'Test 2' satisfied: string 2"
			]);
		});

		it('should return colorized strings, describing the title and rule results, provided options', () => {
			const result = printableVideoResult.getStrings({
				colorized: true
			});
			expect(result).toStrictEqual([
				'\u001B[33m[Video]\u001B[39m File \u001B[32msatisfies\u001B[39m standard',
				"Rule 'Test 1' \u001B[32msatisfied\u001B[39m: string 1",
				"Rule 'Test 2' \u001B[32msatisfied\u001B[39m: string 2"
			]);
		});
	});

	describe('Not satisfied VideoFileAnalysisResult', () => {
		let printableVideoResult: IPrintable;
		beforeEach(() => {
			printableVideoResult = new PrintableVideoResult({
				isSatisfied: false,
				videoRuleResults: [{
					name: 'Test 1',
					isSatisfied: false,
					conditionResults: [{
						isSatisfied: false,
						getResultAsString: () => 'string 1'
					}]
				}, {
					name: 'Test 2',
					isSatisfied: true,
					conditionResults: [{
						isSatisfied: true,
						getResultAsString: () => 'string 2'
					}]
				}]
			});
		});

		it('should return plain strings, describing the title and rule results, provided no options', () => {
			const result = printableVideoResult.getStrings();
			expect(result).toStrictEqual([
				'[Video] File does not satisfy standard',
				"Rule 'Test 1' not satisfied: string 1",
				"Rule 'Test 2' satisfied: string 2"
			]);
		});

		it('should return colorized strings, describing the title and rule results, provided options', () => {
			const result = printableVideoResult.getStrings({
				colorized: true
			});
			expect(result).toStrictEqual([
				'\u001B[33m[Video]\u001B[39m File \u001B[31mdoes not satisfy\u001B[39m standard',
				"Rule 'Test 1' \u001B[31mnot satisfied\u001B[39m: string 1",
				"Rule 'Test 2' \u001B[32msatisfied\u001B[39m: string 2"
			]);
		});
	});
});
