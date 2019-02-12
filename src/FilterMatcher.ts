import { FsTree, FsNode, File, MediaFile } from './fs-tree';
import { FilterMatchPurge } from './purge/FilterMatchPurge';

export class FilterMatcher {
	static async getPurges(node: FsNode, filterRules) {
		// Build list of purges
		const purges = [];
		await FsTree.traverse(node, async node => {
			// Check all rules
			const filterRuleResults = [];
			for (const filterRule of filterRules) {
				if (node instanceof File && node.mimeType.startsWith(filterRule.mimeType)) {
					if (node instanceof MediaFile) {
						const filterRuleResult = filterRule.checkRuleWithPathGetter(node.metadata.get.bind(node.metadata));
						filterRuleResults.push(filterRuleResult);
					}
				}
			}

			// See if any matched all it's conditions
			const anyPassed = filterRuleResults.find(result => result.passed);
			if (anyPassed) {
				purges.push(new FilterMatchPurge(`Filters matched with::`, node, filterRuleResults));
			}
		});

		return purges;
	}
}
