import { z } from 'zod';

export enum RuleType {
	DEFAULT = 'default',
	METADATA = 'metadata',
	SEASON_SIZE_DISCREPANCY = 'season-size-discrepancy'
}

export const RuleTypeSchema = z.nativeEnum(RuleType);
