import { OperatorType } from './rule/condition/OperatorType';
import { FilterFactory, FilterSerialized } from './FilterFactory';
import { Rule } from './rule/Rule';
import { RuleType } from './rule/RuleType';

describe('FilterFactory', () => {
	describe('with filter-simple.json5', () => {
		const filterPath = 'test-assets/filter-simple.json5';
		let parsed: FilterSerialized;
		beforeEach(() => {
			parsed = [{
				mimeType: 'video',
				type: RuleType.METADATA,
				conditions: [
					{
						path: 'video.format',
						operator: OperatorType.EQUAL,
						value: 'hevc'
					},
					{
						path: 'video.framerate',
						operator: OperatorType.GREATER_THAN_OR_EQUAL,
						value: 25
					}
				]
			}];
		});

		it(`can #read('${filterPath}')`, async () => {
			expect(async () => await FilterFactory.read(filterPath)).not.toThrow();
		});

		it('can #parse()', async () => {
			const fileContent = await FilterFactory.read(filterPath);
			const result = await FilterFactory.parse(fileContent);
			expect(result).toStrictEqual(parsed);
		});

		it('can #getFromSerialized()', () => {
			const rules = FilterFactory.getFromSerialized(parsed);

			// Test content of loaded rules
			expect(Array.isArray(rules)).toBe(true);
			for (const rule of rules) {
				expect(rule).toBeInstanceOf(Rule);
			}
		});
	});
});
