import { z } from 'zod';

import { ICondition } from '../condition/ICondition';
import { AllConditionsSchema } from '../condition/conditions-schema';
import { IRule } from './IRule';
import { RuleTypeSchema } from './RuleType';

export const RuleSchema = z.object({
	mimeType: z.string(),
	type: RuleTypeSchema,
	conditions: z.array(AllConditionsSchema)
});

export type RuleSerialized = z.infer<typeof RuleSchema>;

export class Rule implements IRule {
	public readonly mimeType: string;

	private readonly theConditions: ICondition[];

	constructor(mimeType: string, conditions: ICondition[] = []) {
		this.mimeType = mimeType;
		this.theConditions = conditions;
	}

	get conditions(): ICondition[] {
		return [...this.theConditions];
	}
}
