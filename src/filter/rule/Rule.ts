import createDebug from 'debug';
import { z } from 'zod';

import { Condition } from './condition/Condition';
import { ConditionBetweenSchema } from './condition/operators/ConditionBetween';
import { ConditionEqualSchema } from './condition/operators/ConditionEqual';
import { ConditionGreaterThanOrEqualSchema } from './condition/operators/ConditionGreaterThanOrEqual';
import { ConditionInSchema } from './condition/operators/ConditionIn';
import { ConditionLessThanSchema } from './condition/operators/ConditionLessThan';
import { ConditionNotEqualSchema } from './condition/operators/ConditionNotEqual';
import { RuleResult } from './RuleResult';
import { RuleTypeSchema } from './RuleType';

const debug = createDebug('Rule');

const AllConditionOperatorsSchema = z.union([
	ConditionBetweenSchema,
	ConditionEqualSchema,
	ConditionGreaterThanOrEqualSchema,
	ConditionInSchema,
	ConditionLessThanSchema,
	ConditionNotEqualSchema
]);

export const RuleSchema = z.object({
	mimeType: z.string(),
	type: RuleTypeSchema,
	conditions: z.array(AllConditionOperatorsSchema)
});

export type RuleSerialized = z.infer<typeof RuleSchema>;

export class Rule {
	public readonly mimeType: string;
	protected conditions: Condition[];

	constructor(mimeType: string, conditions: Condition[] = []) {
		this.mimeType = mimeType;
		this.conditions = conditions;
	}

	checkRuleWithPathGetter(pathGetterFn: (path: string) => string): RuleResult|undefined {
		// All conditions must be met
		const conditionResults = [];
		for (const condition of this.conditions) {
			// Try to read value
			let value;
			try {
				value = pathGetterFn(condition.path);
			}
			catch (error) {
				// TODO: Log better with verbose, perhaps have a strict mode of some kind?
				// I assume, that currently 'audio.channels < 2' wont fail, if there is no 'channels' (although it probably will fail if there isn't an audio track)
				debug(`Could not read ${condition.path} from ${condition.path}`, (error as Error).message || error);
				continue;
			}

			// Check and store
			const conditionResult = condition.check(value);
			conditionResults.push(conditionResult);
		}

		if (conditionResults.length > 0) {
			return new RuleResult(conditionResults);
		}
	}
}
