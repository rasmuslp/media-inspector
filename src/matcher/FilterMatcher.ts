import { File } from '../fs-tree';
import { MetadataCache } from '../metadata/MetadataCache';
import { IVideoRule } from '../standard/video-standard/IVideoRule';
import { RuleChecker } from '../standard/video-standard/RuleChecker';
import { RuleResult } from '../standard/video-standard/RuleResult';
import { FilterMatch } from './FilterMatch';
import { Match } from './Match';

export class FilterMatcher {
	static async getMatches(metadataCache: MetadataCache, filterRules: IVideoRule[]): Promise<Match[]> {
		// Build list of matches
		const matches: Match[] = [];
		await metadataCache.tree.traverse(async node => {
			// Check all rules
			const ruleResults: RuleResult[] = [];
			for (const rule of filterRules) {
				if (rule.type !== 'metadata') {
					continue;
				}
				const fileMatchesMimeType = node instanceof File && node.mimeType.startsWith('video/');
				const metadata = metadataCache.getMetadata(node.path);
				if (fileMatchesMimeType && metadata) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					const ruleResult = RuleChecker.checkRuleWithPathGetter(rule, metadata.get.bind(metadata));
					if (ruleResult) {
						ruleResults.push(ruleResult);
					}
				}
			}

			// Check if _any_ rule was not satisfied
			const anyNotSatisfied = ruleResults.find(result => !result.satisfied);
			if (anyNotSatisfied) {
				matches.push(new FilterMatch('Filters matched with::', node, ruleResults));
			}
		});

		return matches;
	}
}
