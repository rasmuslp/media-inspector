import execa from 'execa';
import { Readable } from 'stream';

export class ProcessRunner {
	public readonly process: execa.ExecaChildProcess;

	constructor(file: string, args?: string[]) {
		this.process = execa(file, args, {
			all: true
		});
		this.process.stderr.setEncoding('utf8');
		this.process.stdout.setEncoding('utf8');
	}

	get output(): Readable {
		return this.process.all;
	}
}
