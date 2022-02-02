import fs from 'fs';
import { promisify } from 'util';

import JSON5 from 'json5';
import { z } from 'zod';

import { Rule, RuleSchema } from '../standard/rule/Rule';
import { RuleFactory } from '../standard/rule/RuleFactory';

const readFile = promisify(fs.readFile);

const FilterSchema = z.array(RuleSchema);
export type FilterSerialized = z.infer<typeof FilterSchema>;

export class FilterFactory {
	static async read(serializedPath: string): Promise<string> {
		try {
			const fileContent = await readFile(serializedPath, 'utf8');
			return fileContent;
		}
		catch (error) {
			throw new Error(`Could not read filter at '${serializedPath}': ${(error as Error).message}`);
		}
	}

	static async parse(serializedData: string): Promise<FilterSerialized> {
		try {
			const parsed = JSON5.parse<FilterSerialized>(serializedData);
			return parsed;
		}
		catch (error) {
			throw new Error(`Could not parse filter: ${(error as Error).message}`);
		}
	}

	static getFromSerialized(serialized: FilterSerialized): Rule[] {
		const rules: Rule[] = [];
		for (const ruleSerialized of serialized) {
			const rule = RuleFactory.getFromSerialized(ruleSerialized);
			rules.push(rule);
		}

		return rules;
	}
}
