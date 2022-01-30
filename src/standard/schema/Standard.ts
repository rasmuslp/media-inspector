import { z } from 'zod';

import { VideoSchema } from './Video';

export const StandardSchema = z.object({
	video: VideoSchema
});

export type StandardDefinition = z.infer<typeof StandardSchema>;

