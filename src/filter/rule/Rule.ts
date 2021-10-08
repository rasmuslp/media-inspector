import createDebug from 'debug';
import { z } from 'zod';

import { OperatorBetweenSchema } from './condition/operator/OperatorBetween';
import { OperatorEqualSchema } from './condition/operator/OperatorEqual';
import { OperatorGreaterThanOrEqualSchema } from './condition/operator/OperatorGreaterThanOrEqual';
import { OperatorInSchema } from './condition/operator/OperatorIn';
import { OperatorLessThanSchema } from './condition/operator/OperatorLessThan';
import { OperatorNotEqualSchema } from './condition/operator/OperatorNotEqual';
import { Condition } from './condition/Condition';
import { ConditionChecker } from './condition/ConditionChecker';
import { RuleResult } from './RuleResult';
import { RuleTypeSchema } from './RuleType';

const debug = createDebug('Rule');

const AllOperatorsSchema = z.union([
	OperatorBetweenSchema,
	OperatorEqualSchema,
	OperatorGreaterThanOrEqualSchema,
	OperatorInSchema,
	OperatorLessThanSchema,
	OperatorNotEqualSchema
]);

export const RuleSchema = z.object({
	mimeType: z.string(),
	type: RuleTypeSchema,
	conditions: z.array(AllOperatorsSchema)
});

export type RuleSerialized = z.infer<typeof RuleSchema>;

export class Rule {
	public readonly mimeType: string;

	protected conditions: Condition[];

	constructor(mimeType: string, conditions: Condition[] = []) {
		this.mimeType = mimeType;
		this.conditions = conditions;
	}

	checkRuleWithPathGetter(pathGetterFn: (path: string) => number | string): RuleResult | undefined {
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
			const conditionResult = ConditionChecker.getResultFor(condition, value);
			conditionResults.push(conditionResult);
		}

		if (conditionResults.length > 0) {
			return new RuleResult(conditionResults);
		}

		return undefined;
	}
}
