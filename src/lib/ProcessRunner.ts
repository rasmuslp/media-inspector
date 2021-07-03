import execa from 'execa';
import { Readable } from 'stream';

export class ProcessRunner {
	private readonly process: execa.ExecaChildProcess;

	constructor(file: string, arguments_?: string[]) {
		this.process = execa(file, arguments_, {
			all: true
		});
		this.process.stderr.setEncoding('utf8');
		this.process.stdout.setEncoding('utf8');
	}

	async promise(): Promise<execa.ExecaChildProcess> {
		return this.process;
	}

	get all(): Readable {
		return this.process.all;
	}
}
