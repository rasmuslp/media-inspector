import { FsNode } from './FsNode';
import { PathSorters } from './PathSorters';
import { Tree, TreeSerialized } from './Tree';

const FsNodeKeyMapper = (fsNode: FsNode): string => fsNode.path;

export class FsTree extends Tree<FsNode> {
	constructor(rootNode: FsNode) {
		super(FsNodeKeyMapper, rootNode);
	}

	getDataForSerialization(): TreeSerialized {
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
