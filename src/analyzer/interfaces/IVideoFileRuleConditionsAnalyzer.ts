import { IVideoRule } from '../../standard/video-standard/IVideoRule';
import { IConditionResult } from './IConditionResult';

export interface IVideoFileRuleConditionsAnalyzer {
	analyze(filePath: string, rule: IVideoRule): IConditionResult[];
}
