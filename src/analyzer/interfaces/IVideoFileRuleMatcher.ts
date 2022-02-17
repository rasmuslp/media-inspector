import { File } from '../../fs-tree';
import { IVideoRuleMatch } from '../../standard/video-standard/IVideoRule';

export interface IVideoFileRuleMatcher {
	match(file: File, videoRuleMatch: IVideoRuleMatch): boolean
}
