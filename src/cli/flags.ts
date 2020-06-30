import { flags } from '@oclif/command';

export const verbose = flags.boolean({
	char: 'v',
	default: () => false,
	description: 'Get more details of the operation and state'
});
