import Command from '@oclif/command';

export default abstract class BaseCommand extends Command {
	async catch(error) {
		return super.catch(error);
	}
}
