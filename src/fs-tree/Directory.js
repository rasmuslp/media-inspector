const FsObject = require('./FsObject');
const RecommendedPurgeError = require('./RecommendedPurgeError');

class Directory extends FsObject {
	constructor(objectPath, stats, children = []) {
		super(objectPath, stats);
		this._children = children;
		this._fsObjectType = 'directory';

		for (const child of children) {
			child._parent = this;
		}
	}

	// Children before parents
	static getSortByPathDirFile(a, b) {
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
		const sorted = this._children.sort(this.constructor.getSortByPathDirFile);

		return sorted;
	}

	get directories() {
		return this._children.filter(i => i._type === 'directory');
	}

	get files() {
		return this._children.filter(i => i._type === 'file');
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
		sorted.sort(this.constructor.getSortByPathDirFile);

		return sorted;
	}

	async getTreePurges(options = {}) {
		const purges = [];

		const nodes = await this.getTreeSorted();
		for (const node of nodes) {
			// Get the nodes own list of purgeable files
			const nodePrunes = await node.getPurges(options);
			purges.push(...nodePrunes);
		}

		return purges;
	}

	getPurges(options = {}) {
		if (options.includeRecommended) {
			if (!this.children || this.children.length === 0) {
				return [{
					fsObject: this,
					reason: new RecommendedPurgeError(`Directory empty`)
				}];
			}
		}

		return [];
	}

	async traverseTree(nodeFn) {
		const queue = [this];
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

module.exports = Directory;
