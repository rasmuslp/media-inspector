import { Command } from '@oclif/core';

export default abstract class BaseCommand extends Command {
	async catch(error: Record<string, unknown>) {
		return super.catch(error);
	}
}
