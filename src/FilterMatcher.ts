const debug = require('debug')('FilterMatcher');

import { FsTree, FsObject, MediaFile, Directory } from './fs-tree';
import { FilterResult } from './filter/FilterResult';
import { FilterMatchPurge } from './purge/FilterMatchPurge';

export class FilterMatcher {
	static async getPurges(node: FsObject, filtersByType = {}) {
		// Build list of purges
		const purges = [];
		await FsTree.traverse(node, async node => {
			if (node instanceof MediaFile && node.type in filtersByType) {
				const filters = filtersByType[node.type];

				// No filters, thats a pass
				if (filters.length === 0) {
					return;
				}

				// Check all filters
				let results = [];
				for (const filter of filters) {
					const result = FilterMatcher._checkFilterForMediaFile(filter, node);
					results.push(result);
				}

				// See if any passed all it's conditions
				const anyPassed = results.find(result => result.passed);
				if (anyPassed) {
					purges.push(new FilterMatchPurge(`Filters matched with::`, node, results));
				}
			}
		});

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

	static _checkFilterForMediaFile(filter, mediaFile: MediaFile) {
		// All conditions must be met
		const results = [];
		for (const filterCondition of filter) {
			// Try to read value
			let value;
			try {
				value = mediaFile.metadata.get(filterCondition.path);
			}
			catch (e) {
				// Swallow: Could not get property? Ee count that as a pass
				debug(`Could not read ${filterCondition.path} from ${mediaFile.path}`, e.message || e);
				continue;
			}

			// Check and store
			const filterConditionResult = filterCondition.check(value);
			results.push(filterConditionResult);
		}

		return new FilterResult(results);
	}
}
