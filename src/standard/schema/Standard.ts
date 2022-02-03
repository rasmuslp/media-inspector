import { z } from 'zod';

import { VideoStandardSchema } from './Video';

export const StandardSchema = z.object({
	video: VideoStandardSchema
}).strict();

export type StandardDefinition = z.infer<typeof StandardSchema>;
