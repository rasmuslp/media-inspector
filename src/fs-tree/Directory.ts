import { z } from 'zod';

import { FsNode, FsNodeSchema } from './FsNode';

export const DirectorySchema = FsNodeSchema;
type DirectoryData = z.infer<typeof DirectorySchema>;

export class Directory extends FsNode<DirectoryData> {}
