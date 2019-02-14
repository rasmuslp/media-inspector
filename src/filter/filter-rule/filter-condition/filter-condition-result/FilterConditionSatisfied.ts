import { FilterConditionResult } from './FilterConditionResult';

export class FilterConditionSatisfied extends FilterConditionResult {
	get satisfied(): boolean {
		return true;
	}
}
