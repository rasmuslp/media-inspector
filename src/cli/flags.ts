import { flags } from '@oclif/command';

export const verbose = flags.boolean({
	char: 'v',
	default: false,
	description: 'Enable to get detailed information and progress'
});
