import { z } from 'zod';

import { VideoStandardSchema } from './video-standard/VideoStandardSchema';

export const StandardSchema = z.object({
	video: VideoStandardSchema
}).strict();

export type StandardDefinition = z.infer<typeof StandardSchema>;
