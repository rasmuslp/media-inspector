import { z } from 'zod';

import { AllConditionsSchema } from '../condition/ConditionSchema';

const VideoErrorDetectorSchema = z.object({
	'demux-only': z.boolean().default(false)
}).strict();

const VideoRuleMatchSchema = z.object({
	fileExtension: z.string().optional(),
	metadata: z.array(AllConditionsSchema).nonempty().optional(),
	mimeType: z.string().optional()
});

const VideoRuleSchema = z.object({
	name: z.string(),
	match: VideoRuleMatchSchema.optional(),
	type: z.string(), // TODO: Enum
	conditions: z.array(AllConditionsSchema).nonempty()
}).strict();

export type VideoRuleSerialized = z.infer<typeof VideoRuleSchema>;

export const VideoStandardSchema = z.object({
	'error-detector': VideoErrorDetectorSchema.optional(),
	rules: z.array(VideoRuleSchema)
}).strict();

export type VideoStandardDefinition = z.infer<typeof VideoStandardSchema>;
