const FsObject = require('./FsObject');

class Directory extends FsObject {
	constructor(objectPath, stats, children = []) {
		super(objectPath, stats);
		this._children = children;
		this._fsObjectType = 'directory';

		for (const child of children) {
			child._parent = this;
		}
	}

	get childrenSorted() {
		const sorted = this._children.sort((a, b) => {
			if (a.isDirectory && b.isDirectory) {
				return a.path.localeCompare(b.path);
			}

			if (a.isDirectory && b.isFile) {
				return -1;
			}

			if (a.isFile && b.isDirectory) {
				return 1;
			}

			return a.path.localeCompare(b.path);
		});

		return sorted;
	}

	get directories() {
		return this._children.filter(i => i._type === 'directory');
	}

	get files() {
		return this._children.filter(i => i._type === 'file');
	}

	async getPruneList(options = {}) {
		const pruneList = [];

		for (const child of this.childrenSorted) {
			// Recurse and add to list
			const childPruneList = await child.getPruneList(options);
			pruneList.push(...childPruneList);
		}

		// TODO: Include this, iff empty or will be empty
		if (options.includeRecommended) {
			if (!this._children || this._children.length === 0) {
				pruneList.push({
					fsObject: this,
					reason: new Error(`Directory empty`)
				});
			}
		}

		return pruneList;
	}

	async traverseTree(nodeFn) {
		const queue = [this];
		while (queue.length) {
			// Get node
			const node = queue.pop();

			// Queue any children
			if (node._children) {
				queue.push(...node.childrenSorted);
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
