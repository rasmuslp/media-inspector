import { FsTree, FsNode, File, MediaFile } from './fs-tree';
import { FilterMatchPurge } from './purge/FilterMatchPurge';
import { FilterRuleResult } from './filter/filter-rule/FilterRuleResult';

export class FilterMatcher {
	static async getPurges(node: FsNode, filterRules) {
		// Build list of purges
		const purges = [];
		await FsTree.traverse(node, node => {
			// Check all rules
			const filterRuleResults: FilterRuleResult[] = [];
			for (const filterRule of filterRules) {
				if (node instanceof File && node.mimeType.startsWith(filterRule.mimeType)) {
					if (node instanceof MediaFile) {
						const filterRuleResult = filterRule.checkRuleWithPathGetter(node.metadata.get.bind(node.metadata));
						filterRuleResults.push(filterRuleResult);
					}
				}
			}

			// See if any matched all it's conditions
			const anyMatch = filterRuleResults.find(result => result.satisfied);
			if (anyMatch) {
				purges.push(new FilterMatchPurge(`Filters matched with::`, node, filterRuleResults));
			}
		});

		return purges;
	}
}
