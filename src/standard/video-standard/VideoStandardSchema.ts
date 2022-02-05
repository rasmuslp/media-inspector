import { z } from 'zod';

import { RuleSchema } from '../rule/RuleSchema';

const VideoErrorDetectorSchema = z.object({
	'demux-only': z.boolean().default(false)
}).strict();

export const VideoStandardSchema = z.object({
	'error-detector': VideoErrorDetectorSchema.optional(),
	rules: z.array(RuleSchema)
}).strict();

export type VideoStandardDefinition = z.infer<typeof VideoStandardSchema>;
