import { z } from 'zod';

import { Serializable, SerializableSchema } from '../serializable/Serializable';

export const TreeSchema = z.object({
	nodes: z.array(SerializableSchema)
});
export type TreeSerialized = z.infer<typeof TreeSchema>;

export abstract class Tree<T, U = TreeSerialized> extends Serializable<U> {
	private readonly keyMapper: (T) => string;

	protected readonly rootNode: T;
	protected readonly nodes = new Map<string, T>();
	protected readonly relations = new Map<string, string[]>();

	constructor(keyMapper: (T) => string, rootNode: T) {
		super();
		this.keyMapper = keyMapper;

		this.rootNode = rootNode;
		this.nodes.set(this.keyMapper(this.rootNode), this.rootNode);
	}

	get root(): T {
		return this.rootNode;
	}

	/**
	 * A node can have only 1 relation _to_ it, but many relations _from_ it, to other nodes.
	 * @param fromNode Must be a known node
	 * @param toNode Must be an unknown node
	 */
	addRelation(fromNode: T, toNode: T): void {
		const fromKey = this.keyMapper(fromNode);
		const toKey = this.keyMapper(toNode);

		if (!this.nodes.has(fromKey)) {
			throw new Error(`Cannot add relation: fromNode is unknown. Key was: ${fromKey}`);
		}
		if (this.nodes.has(toKey)) {
			throw new Error(`Cannot add relation: toNode is not unique. Key was: ${toKey}`);
		}

		this.nodes.set(toKey, toNode);

		if (!this.relations.has(fromKey)) {
			this.relations.set(fromKey, []);
		}
		const fromExistingRelations = this.relations.get(fromKey);
		fromExistingRelations.push(toKey);
	}

	// Get getRelationsFrom
	getDirectChildren(ofNode: T): T[] {
		const nodeKey = this.keyMapper(ofNode);
		if (!this.relations.has(nodeKey)) {
			return [];
		}
		const nodeRelations = this.relations.get(nodeKey);
		const children = nodeRelations.map(key => this.nodes.get(key));
		return children;
	}

	async traverse(nodeFn: (node: T) => Promise<void>, fromNode = this.rootNode): Promise<void> {
		await this.traverseBfs(nodeFn, fromNode);
	}

	async traverseBfs(nodeFn: (node: T) => Promise<void>, fromNode = this.rootNode): Promise<void> {
		const queue: [T] = [fromNode];
		while (queue.length > 0) {
			const node = queue.shift()!;

			const children = this.getDirectChildren(node);
			queue.push(...children);

			// Apply fn
			await nodeFn(node);
		}
	}

	async find(matchFn: (node: T) => Promise<boolean>, fromNode = this.rootNode): Promise<T[]> {
		const matches: T[] = [];

		await this.traverseBfs(async node => {
			// Check match
			const match = await matchFn(node);
			if (match) {
				matches.push(node);
			}
		}, fromNode);

		return matches;
	}

	async getAsList(fromNode: T): Promise<T[]> {
		const nodes: T[] = [];

		await this.traverseBfs(async node => void nodes.push(node), fromNode);

		return nodes;
	}

	getAsListSync(): T[] {
		const list = [...this.nodes.values()];
		return list;
	}
}
