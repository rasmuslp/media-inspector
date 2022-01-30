import { z } from 'zod';

import { RuleType } from '../../filter/rule/RuleType';
import { AllConditionsSchema } from '../../filter/rule/condition/conditions-schema';

const VideoErrorDetectorSchema = z.object({
	'demux-only': z.boolean().default(false)
});

const VideoRuleSchema = z.object({
	name: z.string(),
	match: z.object({
		fileExtension: z.string().optional(),
		mimeType: z.string().optional(),
		metadata: z.array(AllConditionsSchema).optional()
	}).optional(),
	type: z.nativeEnum(RuleType),
	conditions: z.array(AllConditionsSchema)
});

export const VideoSchema = z.object({
	'error-detector': VideoErrorDetectorSchema.optional(),
	rules: z.array(VideoRuleSchema).optional()
});
