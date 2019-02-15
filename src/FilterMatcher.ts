import { FsTree, FsNode, File, MediaFile } from './fs-tree';
import { FilterMatchPurge } from './purge/FilterMatchPurge';
import { RuleResult } from './filter/rule/RuleResult';

export class FilterMatcher {
	static async getPurges(node: FsNode, filterRules) {
		// Build list of purges
		const purges = [];
		await FsTree.traverse(node, node => {
			// Check all rules
			const ruleResults: RuleResult[] = [];
			for (const rule of filterRules) {
				if (node instanceof File && node.mimeType.startsWith(rule.mimeType)) {
					if (node instanceof MediaFile) {
						const ruleResult = rule.checkRuleWithPathGetter(node.metadata.get.bind(node.metadata));
						ruleResults.push(ruleResult);
					}
				}
			}

			// See if any matched all it's conditions
			const anyMatch = ruleResults.find(result => result.satisfied);
			if (anyMatch) {
				purges.push(new FilterMatchPurge(`Filters matched with::`, node, ruleResults));
			}
		});

		return purges;
	}
}
