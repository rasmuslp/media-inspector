import { lineStream } from '../../lib/line-stream';
import { ProcessRunner } from '../../lib/ProcessRunner';
import { clone } from '../../utils/clone';
import { ErrorSummary } from './output-parser/ErrorSummary';
import { OutputParser } from './output-parser/OutputParser';
import { Progress } from './output-parser/Progress';

type Listener = (progress: Progress, errorSummary: ErrorSummary) => void;

export class FFmpegVideoErrorDetector {
	private readonly path: string;

	private ffmpegProcess: ProcessRunner;
	private readonly outputParser = new OutputParser();

	private readonly listeners: Listener[] = [];

	private readonly lines = []; // For now, for debugging

	constructor(path: string) {
		this.path = path;
	}

	// Throws or returns summary
	start(): Promise<ErrorSummary> {
		if (!this.ffmpegProcess) {
			this.ffmpegProcess = new ProcessRunner('ffmpeg', ['-v', 'info', '-i', this.path, '-f', 'null', '-']);
		}

		this.ffmpegProcess.output.pipe(lineStream()).on('data', (line: string) => {
			this.handleLine(line);
		});

		return this.ffmpegProcess.process.then(() => {
			return this.outputParser.getErrorSummary();
		});
	}

	private handleLine(line: string): void {
		this.lines.push(line);
		const [progress, errorSummary] = this.outputParser.parse(line);
		this.notifyListeners(progress, errorSummary);
	}

	public addListener(listener: Listener): void {
		this.listeners.push(listener);
		listener(this.outputParser.getProgress(), this.outputParser.getErrorSummary());
	}

	private notifyListeners(progress: Progress, errorSummary: ErrorSummary): void {
		for (const listener of this.listeners) {
			listener(clone(progress), clone(errorSummary));
		}
	}
}
