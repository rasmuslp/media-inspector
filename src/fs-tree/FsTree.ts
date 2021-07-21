import { z } from 'zod';

import { SerializableSchema } from '../serializable/Serializable';
import { FsNode } from './FsNode';
import { PathSorters } from './PathSorters';
import { Tree } from './Tree';
import { FileSchema } from './File';
import { DirectorySchema } from './Directory';

export const FsTreeSchema = SerializableSchema.extend({
	nodes: z.array(FileSchema.or(DirectorySchema))
});
export type FsTreeData = z.infer<typeof FsTreeSchema>;

const FsNodeKeyMapper = (fsNode: FsNode): string => fsNode.path;

export class FsTree extends Tree<FsNode, FsTreeData> {
	constructor(rootNode: FsNode) {
		super(FsNodeKeyMapper, rootNode);
	}

	getDataForSerialization(): Partial<FsTreeData> {
		return {
			nodes: this.getAsSortedListSync().map(node => node.serialize())
		};
	}

	async getSize(fromNode = this.rootNode): Promise<number> {
		const sizes: number[] = [];

		await this.traverse(async node => void sizes.push(node.size), fromNode);

		let totalSize = 0;
		for (const size of sizes) {
			totalSize += size;
		}

		return totalSize;
	}

	async getAsSortedList(fromNode = this.rootNode): Promise<FsNode[]> {
		const nodes = await this.getAsList(fromNode);
		const sorted = [...nodes].sort((a, b) => PathSorters.childrenBeforeParents(a.path, b.path));

		return sorted;
	}

	getAsSortedListSync(): FsNode[] {
		const nodes = this.getAsListSync();
		const sorted = [...nodes].sort((a, b) => PathSorters.childrenBeforeParents(a.path, b.path));

		return sorted;
	}
}
