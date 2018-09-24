const FsObject = require('./FsObject');

class Directory extends FsObject {
	constructor(objectPath, stats, children) {
		super(objectPath, stats);
		this._children = children;
		this._type = 'directory';

		for (const child of children) {
			child._parent = this;
		}
	}

	get directories() {
		return this._children.filter(i => i._type === 'directory');
	}

	get files() {
		return this._children.filter(i => i._type === 'file');
	}

	async traverseTree(nodeFn) {
		const queue = [this];
		while (queue.length) {
			// Get node
			const node = queue.pop();

			// Queue any children
			if (node._children && node._children.length) {
				queue.push(...node._children);
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
