import { FsTree, File } from '../fs-tree';
import { FilterMatch } from './FilterMatch';
import { Rule } from '../filter/rule/Rule';
import { RuleResult } from '../filter/rule/RuleResult';
import { MetadataCache } from '../metadata/MetadataCache';
import { Match } from './Match';

export class FilterMatcher {
	static async getMatches(metadataCache: MetadataCache, filterRules: Rule[]): Promise<Match[]> {
		// Build list of matches
		const matches: Match[] = [];
		await FsTree.traverse(metadataCache.rootNode, async node => {
			// Check all rules
			const ruleResults: RuleResult[] = [];
			for (const rule of filterRules) {
				const fileMatchesMimeType = node instanceof File && node.mimeType.startsWith(rule.mimeType);
				const metadata = metadataCache.getMetadata(node.path);
				if (fileMatchesMimeType && metadata) {
					const ruleResult = rule.checkRuleWithPathGetter(metadata.get.bind(metadata));
					if (ruleResult) {
						ruleResults.push(ruleResult);
					}
				}
			}

			// See if any matched all it's conditions
			const anyMatch = ruleResults.find(result => result.satisfied);
			if (anyMatch) {
				matches.push(new FilterMatch('Filters matched with::', node, ruleResults));
			}
		});

		return matches;
	}
}
