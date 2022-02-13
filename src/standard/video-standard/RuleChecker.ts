import { ConditionAnalyzer } from '../../analyzer/condition/ConditionAnalyzer';
import { ConditionsAnalyzer } from '../../analyzer/condition/ConditionsAnalyzer';
import { IConditionResult } from '../../analyzer/condition/IConditionResult';
import { Metadata } from '../../metadata/Metadata';
import { RuleResult } from './RuleResult';
import { IVideoRule } from './IVideoRule';

export class RuleChecker {
	static conditionsAnalyzer = new ConditionsAnalyzer(new ConditionAnalyzer());

	static checkRuleWithPathGetter(rule: IVideoRule, metadata: Metadata): RuleResult {
		const conditionResults: IConditionResult[] = this.conditionsAnalyzer.analyze(rule.conditions, metadata);

		return new RuleResult(conditionResults);
	}
}
