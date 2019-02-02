import {FsObject, FsObjectType} from './FsObject';
import {RecommendedPurge} from '../purge/RecommendedPurge';

export class Directory extends FsObject {
	_children: FsObject[];

	constructor(objectPath, stats, children = []) {
		super(objectPath, stats);
		this._children = children;
		this._fsObjectType = FsObjectType.DIRECTORY;

		for (const child of children) {
			child._parent = this;
		}
	}

	// Children before parents
	static getSortFnByPathDirFile(a, b) {
		if (a.path.startsWith(b.path)) {
			return -1;
		}
		else if (b.path.startsWith(a.path)) {
			return 1;
		}

		return a.path.localeCompare(b.path);
	}

	get children() {
		return this._children;
	}

	get childrenSorted() {
		const sorted = this._children.sort(Directory.getSortFnByPathDirFile);

		return sorted;
	}

	get directories() {
		return this._children.filter(i => i.isDirectory);
	}

	get files() {
		return this._children.filter(i => i.isFile);
	}

	// Returns list of tree, this included
	async getTree() {
		const nodes = [];
		await this.traverseTree(node => {
			nodes.push(node);
		});

		return nodes;
	}

	async getTreeSorted() {
		const tree = await this.getTree();
		let sorted = [...tree];
		sorted.sort(Directory.getSortFnByPathDirFile);

		return sorted;
	}

	async getTreePurges(options = {}) {
		// Gets nodes
		const nodes = await this.getTree();

		// Build list of purges
		const purges = [];
		for (const node of nodes) {
			// Get the nodes own list of purgeable files
			const nodePrunes = await node.getPurges(options);
			purges.push(...nodePrunes);
		}

		// Dedupe list
		const dedupedMap = new Map();
		for (const purge of purges) {
			const existing = dedupedMap.get(purge.fsObject);
			if (existing) {
				// Update if current has better score
				if (existing.score < purge.score) {
					dedupedMap.set(purge.fsObject, purge);
				}
			}
			else {
				// Store as unique otherwise
				dedupedMap.set(purge.fsObject, purge);
			}
		}

		// Sort deduped
		const deduped = Array.from(dedupedMap.values()).sort((a, b) => Directory.getSortFnByPathDirFile(a.fsObject, b.fsObject));

		return deduped;
	}

	getPurges(options = {}) {
		// @ts-ignore
		if (options.includeRecommended) {
			if (!this.children || this.children.length === 0) {
				return [new RecommendedPurge(`Directory empty`, this)];
			}
		}

		return [];
	}

	async traverseTree(nodeFn) {
		const queue: [FsObject] = [this];
		while (queue.length) {
			// Get node
			const node = queue.pop();

			// Queue any children
			if (node.children.length > 0) {
				queue.push(...node.children);
			}

			// Apply fn
			await nodeFn(node);
		}
	}

	async findInTree(matchFn) {
		const matches = [];

		await this.traverseTree(async node => {
			// Check match
			const match = await matchFn(node);
			if (match) {
				matches.push(node);
			}
		});

		return matches;
	}

	async getSizeOfTree() {
		let sizes = [];

		await this.traverseTree(node => sizes.push(node.size));

		return sizes.reduce((sum, cur) => sum + cur, 0);
	}
}
