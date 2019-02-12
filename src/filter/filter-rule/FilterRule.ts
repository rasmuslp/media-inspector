import {FilterRuleResult} from './FilterRuleResult';

export interface FilterRuleData {
	mimeType: string;
	type: FilterRuleType
}

export enum FilterRuleType {
	METADATA = 'metadata',
	SEASON_SIZE_DISCREPANCY = 'season-size-discrepancy'
}

export abstract class FilterRule {
	_mimeType: string;

	constructor(mimeType: string) {
		this._mimeType = mimeType;
	}

	get mimeType() {
		return this._mimeType;
	}

	abstract checkRuleWithPathGetter(pathGetterFn: Function): FilterRuleResult;
}
