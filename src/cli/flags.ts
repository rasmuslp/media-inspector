import { Flags } from '@oclif/core';

export const verbose = Flags.boolean({
	char: 'v',
	default: false,
	description: 'Enable to get detailed information and progress'
});
