import { File } from '../fs-tree';
import { MetadataCache } from '../metadata/MetadataCache';
import { Rule } from '../standard/rule/Rule';
import { RuleResult } from '../standard/rule/RuleResult';
import { FilterMatch } from './FilterMatch';
import { Match } from './Match';

export class FilterMatcher {
	static async getMatches(metadataCache: MetadataCache, filterRules: Rule[]): Promise<Match[]> {
		// Build list of matches
		const matches: Match[] = [];
		await metadataCache.tree.traverse(async node => {
			// Check all rules
			const ruleResults: RuleResult[] = [];
			for (const rule of filterRules) {
				const fileMatchesMimeType = node instanceof File && node.mimeType.startsWith(rule.mimeType);
				const metadata = metadataCache.getMetadata(node.path);
				if (fileMatchesMimeType && metadata) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
