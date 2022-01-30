import { z } from 'zod';

export enum RuleType {
	ERROR = 'error',
	METADATA = 'metadata',
	SEASON_SIZE_DISCREPANCY = 'season-size-discrepancy'
}

export const RuleTypeSchema = z.nativeEnum(RuleType);
