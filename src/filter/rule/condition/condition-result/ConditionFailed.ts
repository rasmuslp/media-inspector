import { ConditionResult } from './ConditionResult';

export class ConditionFailed extends ConditionResult {
	get satisfied(): boolean {
		return false;
	}
}
