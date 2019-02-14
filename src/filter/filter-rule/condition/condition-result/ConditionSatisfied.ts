import { ConditionResult } from './ConditionResult';

export class ConditionSatisfied extends ConditionResult {
	get satisfied(): boolean {
		return true;
	}
}
