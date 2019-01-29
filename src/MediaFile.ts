const debug = require('debug')('MediaFile');

import { File, RecommendedPurge } from './fs-tree';
import { getMetadata, MediainfoMetadata } from './mediainfo';

import { FilterResult } from './filter/FilterResult';
import { FilterRejectionPurge } from './filter/FilterRejectionPurge';

export class MediaFile extends File {
	_metadata: MediainfoMetadata;

	constructor(objectPath, stats, mimeType) {
		super(objectPath, stats, mimeType);
	}

	get metadata() {
		return this._metadata;
	}

	async fetchMetadata() {
		this._metadata = await getMetadata(this.path);

		return this.metadata;
	}

	checkFilter(filter) {
		// All conditions must be met
		const results = [];
		for (const filterCondition of filter) {
			const [trackType, property] = filterCondition.pathParts;

			// Try to read value
			let value;
			try {
				value = this.metadata.get(trackType, property);
			}
			catch (e) {
				// Swallow: Could not get property? Ee count that as a pass
				debug(`Could not read ${filterCondition.path} from ${this.path}`, e.message || e);
				continue;
			}

			// Check and store
			const filterConditionResult = filterCondition.check(value);
			results.push(filterConditionResult);
		}

		return new FilterResult(results);
	}

	// Returns false if passed, Purge if rejected
	isRejected(filters = []) {
		// No filters, thats a pass
		if (filters.length === 0) {
			return false;
		}

		// Check all filters
		let results = [];
		for (const filter of filters) {
			const result = this.checkFilter(filter);
			results.push(result);
		}

		// See if any passed
		const anyPassed = results.find(result => result.passed);
		if (anyPassed) {
			return false;
		}

		// Otherwise reject
		return new FilterRejectionPurge(`Filters failed with::`, this, results);
	}

	// Include recommended
	// @ts-ignore TODO
	async getPurges(options = {}) {
		// @ts-ignore
		if (this.type in options.filtersByType) {
			// Prime metadata for 'isRejected'
			await this.fetchMetadata();

			// @ts-ignore
			const rejected = this.isRejected(options.filtersByType[this.type]);
			if (!rejected) {
				return [];
			}

			// Rejected
			// @ts-ignore
			if (options.includeRecommended) {
				// Take parent and all children when this was the majority
				if (this.size >= 0.9 * await this.parent.getSizeOfTree()) {
					// Mark parent and tree
					const parentTree = await this.parent.getTreeSorted();
					const purges = parentTree.map(node => {
						if (this === node) {
							return rejected;
						}

						return new RecommendedPurge(`Auxiliary file or folder to ${this.path}`, this);
					});

					return purges;
				}
			}

			return [rejected];
		}

		return [];
	}
}
