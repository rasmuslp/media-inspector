import { LineParser } from './LineParser';

function generateProgressParserMatcher(parameter: string) {
	return new RegExp(parameter + '=\\s*([^\\s]*)');
}

export interface ParsedProgressLine {
	frame: number;
	fps: number;
	q: string;
	size: string;
	time: string;
	bitrate: string;
	speed: string;
}

export class ProgressLineParser implements LineParser<ParsedProgressLine> {
	static progressFrameMatcher = generateProgressParserMatcher('frame');
	static progressFpsMatcher = generateProgressParserMatcher('fps');
	static progressQMatcher = generateProgressParserMatcher('q');
	static progressSizeMatcher = generateProgressParserMatcher('size');
	static progressTimeMatcher = generateProgressParserMatcher('time');
	static progressBitrateMatcher = generateProgressParserMatcher('bitrate');
	static progressSpeedMatcher = generateProgressParserMatcher('speed');

	canParse(line: string): boolean {
		return line.startsWith('frame');
	}

	parse(line: string): ParsedProgressLine {
		return {
			frame: Number.parseInt(ProgressLineParser.progressFrameMatcher.exec(line)?.[1]),
			fps: Number.parseInt(ProgressLineParser.progressFpsMatcher.exec(line)?.[1]),
			q: ProgressLineParser.progressQMatcher.exec(line)?.[1],
			size: ProgressLineParser.progressSizeMatcher.exec(line)?.[1],
			time: ProgressLineParser.progressTimeMatcher.exec(line)?.[1],
			bitrate: ProgressLineParser.progressBitrateMatcher.exec(line)?.[1],
			speed: ProgressLineParser.progressSpeedMatcher.exec(line)?.[1]
		};
	}
}
