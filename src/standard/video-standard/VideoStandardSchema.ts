import { z } from 'zod';

import { RuleSchema } from '../rule/RuleSchema';

const VideoErrorDetectorSchema = z.object({
	'demux-only': z.boolean().default(false)
}).strict();

export const VideoStandardSchema = z.object({
	'error-detector': VideoErrorDetectorSchema.optional(),
	// TODO: Something is odd here... Is it a generic Rule, or should it be a VideoRule?
	// If it's generic, how do I handle the different types? Generics?
	rules: z.array(RuleSchema)
}).strict();

export type VideoStandardDefinition = z.infer<typeof VideoStandardSchema>;
