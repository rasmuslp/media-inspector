import * as t from 'io-ts';

export enum RuleType {
	DEFAULT = 'default',
	METADATA = 'metadata',
	SEASON_SIZE_DISCREPANCY = 'season-size-discrepancy'
}

export const RuleTypeValidator = t.keyof({
	[RuleType.DEFAULT]: null,
	[RuleType.METADATA]: null,
	[RuleType.SEASON_SIZE_DISCREPANCY]: null
});
