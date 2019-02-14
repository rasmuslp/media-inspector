import { FilterConditionResult } from './FilterConditionResult';

export class FilterConditionFailed extends FilterConditionResult {
	get satisfied(): boolean {
		return false;
	}
}
