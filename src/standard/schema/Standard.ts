import { z } from 'zod';

import { VideoSchema } from './Video';

export const StandardSchema = z.object({
	video: VideoSchema
}).strict();

export type StandardDefinition = z.infer<typeof StandardSchema>;
