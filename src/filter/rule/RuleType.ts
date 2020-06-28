import * as t from 'io-ts';

export enum RuleType {
	DEFAULT = 'default',
	METADATA = 'metadata',
	SEASON_SIZE_DISCREPANCY = 'season-size-discrepancy'
}

export const RuleTypeValidator = t.keyof({
	[RuleType.DEFAULT]: undefined,
	[RuleType.METADATA]: undefined,
	[RuleType.SEASON_SIZE_DISCREPANCY]: undefined
});
