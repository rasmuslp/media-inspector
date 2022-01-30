import createDebug from 'debug';
import { z } from 'zod';

import { Condition } from './condition/Condition';
import { ConditionChecker } from './condition/ConditionChecker';
import { ConditionResult } from './condition/ConditionResult';
import { AllConditionsSchema } from './condition/conditions-schema';
import { RuleResult } from './RuleResult';
import { RuleTypeSchema } from './RuleType';

const debug = createDebug('Rule');

export const RuleSchema = z.object({
	mimeType: z.string(),
	type: RuleTypeSchema,
	conditions: z.array(AllConditionsSchema)
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
		const conditionResults: ConditionResult[] = [];
		for (const condition of this.conditions) {
			// Try to read value
			let value: number | string;
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
