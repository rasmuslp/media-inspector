import { z } from 'zod';

import { AllConditionsSchema } from '../condition/conditions-schema';
import { RuleType } from './RuleType';

export const RuleSchema = z.object({
	mimeType: z.string(),
	type: z.nativeEnum(RuleType),
	conditions: z.array(AllConditionsSchema)
});

export type RuleSerialized = z.infer<typeof RuleSchema>;
