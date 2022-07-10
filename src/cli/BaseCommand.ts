import { Command } from '@oclif/core';

export default abstract class BaseCommand extends Command {
	async catch(error: Error & { exitCode?: number }) {
		return super.catch(error);
	}
}
