import { FsTree, FsNode, File, MediaFile } from '../fs-tree';
import { FilterMatch } from './FilterMatch';
import { Rule } from '../filter/rule/Rule';
import { RuleResult } from '../filter/rule/RuleResult';
import { Match } from './Match';

export class FilterMatcher {
	static async getMatches(node: FsNode, filterRules: Rule[]): Promise<Match[]> {
		// Build list of matches
		const matches: Match[] = [];
		await FsTree.traverse(node, async node => {
			// Check all rules
			const ruleResults: RuleResult[] = [];
			for (const rule of filterRules) {
				if (node instanceof File && node.mimeType.startsWith(rule.mimeType)) {
					if (node instanceof MediaFile) {
						const ruleResult = rule.checkRuleWithPathGetter(node.metadata.get.bind(node.metadata));
						if (ruleResult) {
							ruleResults.push(ruleResult);
						}
					}
				}
			}

			// See if any matched all it's conditions
			const anyMatch = ruleResults.find(result => result.satisfied);
			if (anyMatch) {
				matches.push(new FilterMatch('Filters matched with::', node, ruleResults));
			}
		});

		// TODO: Check, do we need to sort here? (We did before)
		return matches;
	}
}
