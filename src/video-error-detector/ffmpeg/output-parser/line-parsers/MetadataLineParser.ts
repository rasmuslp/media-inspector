import { stringToDurationInMillis } from '../duration-helpers';
import { LineParser } from './LineParser';

enum MetadataType {
	FFMPEG = 'FFMPEG',
	INPUT = 'INPUT',
	OUTPUT = 'OUTPUT',
	OTHER = 'OTHER',
}

const whitespaceFromStartMatcher = /^\s+/;
const inputDurationMatcher = /Duration: (?<duration>\d{2,}:\d{2}:\d{2}.\d{2}),/;

/**
 * This should only be passed data not handled by other LineParsers.
 */
export class MetadataLineParser implements LineParser<void> {
	public readonly lines: Record<MetadataType, string[]> = {
		FFMPEG: [],
		INPUT: [],
		OUTPUT: [],
		OTHER: []
	};

	private currentlyProcessing: MetadataType;

	canParse(line: string): boolean {
		return !!line;
	}

	parse(line: string): void {
		// Append as long as there is indentation in the input
		if (whitespaceFromStartMatcher.test(line)) {
			this.lines[this.currentlyProcessing].push(line);
			return;
		}

		this.currentlyProcessing = MetadataLineParser.getMetadataType(line);
		this.lines[this.currentlyProcessing].push(line);
	}

	static getMetadataType(line: string): MetadataType {
		if (line.startsWith('ffmpeg')) {
			return MetadataType.FFMPEG;
		}

		if (line.startsWith('Input')) {
			return MetadataType.INPUT;
		}

		if (line.startsWith('Output')) {
			return MetadataType.OUTPUT;
		}

		return MetadataType.OTHER;
	}

	getDuration(): number {
		const duration = MetadataLineParser.findDuration(this.lines[MetadataType.INPUT]);
		return stringToDurationInMillis(duration);
	}

	static findDuration(lines: string[]): string {
		for (const line of lines) {
			const match = inputDurationMatcher.exec(line);
			if (match?.groups.duration) {
				return match?.groups.duration;
			}
		}

		return '00:00:00.00';
	}
}
