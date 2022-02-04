import { z } from 'zod';

import { AllConditionsSchema } from '../condition/ConditionSchema';

export const RuleSchema = z.object({
	name: z.string(),
	match: z.object({
		fileExtension: z.string().optional(),
		mimeType: z.string().optional()
	}).optional(),
	type: z.string(),
	conditions: z.array(AllConditionsSchema).nonempty()
}).strict();

export type RuleSerialized = z.infer<typeof RuleSchema>;
