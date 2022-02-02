import { Operator } from '../standard/condition/Operator';
import { Rule } from '../standard/rule/Rule';
import { RuleType } from '../standard/rule/RuleType';
import { FilterFactory, FilterSerialized } from './FilterFactory';

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
						operator: Operator.EQUAL,
						value: 'hevc'
					},
					{
						path: 'video.framerate',
						operator: Operator.GREATER_THAN_OR_EQUAL,
						value: 25
					}
				]
			}];
		});

		it(`can #read('${filterPath}')`, async () => {
			expect(async () => FilterFactory.read(filterPath)).not.toThrow();
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
