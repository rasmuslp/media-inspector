import { clone } from '../../../utils/clone';
import { CorruptDecodedFrameLineParser } from './line-parsers/CorruptDecodedFrameLineParser';
import { LastMessageRepeatedLineParser } from './line-parsers/LastMessageRepeatedLineParser';
import { MetadataLineParser } from './line-parsers/MetadataLineParser';
import { ParsedProgressLine, ProgressLineParser } from './line-parsers/ProgressLineParser';
import { StreamLineParser } from './line-parsers/StreamLineParser';
import { ErrorSummary } from './ErrorSummary';
import { Progress } from './Progress';
import { getPercentageCompleted, stringToDurationInMillis } from './duration-helpers';

enum LineType {
	CORRUPT_DECODED_FRAME = 'CORRUPT_DECODED_FRAME',
	LAST_MESSAGE_REPEATED = 'LAST_MESSAGE_REPEATED',
	METADATA = 'METADATA',
	PROGRESS = 'PROGRESS',
	STREAM = 'STREAM'
}

export class OutputParser {
	private readonly corruptDecodedFrameLineParser = new CorruptDecodedFrameLineParser();
	private readonly lastMessageRepeatedLineParser = new LastMessageRepeatedLineParser();
	private readonly metadataParser = new MetadataLineParser();
	private readonly progressLineParser = new ProgressLineParser();
	private readonly streamLineParser = new StreamLineParser();

	private totalDuration: number;

	private lastLineProcessed: string;

	private progress: Progress = {
		percentage: 0
	};

	private errorSummary: ErrorSummary = {
		corruptDecodedFrames: 0,
		streams: 0
	};

	getProgress(): Progress {
		return clone(this.progress);
	}

	getErrorSummary(): ErrorSummary {
		return clone(this.errorSummary);
	}

	parse(line: string): [Progress, ErrorSummary] {
		const lineType = this.getLineType(line);

		if (lineType === LineType.LAST_MESSAGE_REPEATED) {
			const { count } = this.lastMessageRepeatedLineParser.parse(line);
			this.repeatLastLineProcessed(count);
			return [this.progress, this.errorSummary];
		}

		switch (lineType) {
			case LineType.PROGRESS: {
				const progress = this.progressLineParser.parse(line);
				this.updateProgress(progress);
				break;
			}

			case LineType.STREAM: {
				this.streamLineParser.parse(line);
				this.errorSummary.streams++;
				break;
			}

			case LineType.CORRUPT_DECODED_FRAME: {
				this.corruptDecodedFrameLineParser.parse(line);
				this.errorSummary.corruptDecodedFrames++;
				break;
			}

			case LineType.METADATA:
			default:
				this.metadataParser.parse(line);
				if (!this.totalDuration) {
					this.totalDuration = this.metadataParser.getDuration();
				}
				break;
		}

		this.lastLineProcessed = line;

		return [this.progress, this.errorSummary];
	}

	getLineType(line: string): LineType {
		if (this.lastMessageRepeatedLineParser.canParse(line)) {
			return LineType.LAST_MESSAGE_REPEATED;
		}

		if (this.progressLineParser.canParse(line)) {
			return LineType.PROGRESS;
		}

		if (this.streamLineParser.canParse(line)) {
			return LineType.STREAM;
		}

		if (this.corruptDecodedFrameLineParser.canParse(line)) {
			return LineType.CORRUPT_DECODED_FRAME;
		}

		return LineType.METADATA;
	}

	private updateProgress(parsedProgressLine: ParsedProgressLine): void {
		let percentage = 0;
		if (this.totalDuration && parsedProgressLine.time) {
			const position = stringToDurationInMillis(parsedProgressLine.time);
			percentage = getPercentageCompleted(position, this.totalDuration);
		}
		this.progress = {
			percentage
		};
	}

	private repeatLastLineProcessed(count: number): void {
		for (let i = 0; i < count; i++) {
			this.parse(this.lastLineProcessed);
		}
	}
}
