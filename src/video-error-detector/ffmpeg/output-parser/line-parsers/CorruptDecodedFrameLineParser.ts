import { LineParser } from './LineParser';

export interface ParsedCorruptDecodedFrameLine {
	message: string;
}

export class CorruptDecodedFrameLineParser implements LineParser<ParsedCorruptDecodedFrameLine> {
	static lineMatcher = /: (?<message>corrupt decoded frame.*)$/;

	canParse(line: string): boolean {
		return CorruptDecodedFrameLineParser.lineMatcher.test(line);
	}

	parse(line: string): ParsedCorruptDecodedFrameLine {
		const result = CorruptDecodedFrameLineParser.lineMatcher.exec(line);
		return {
			message: result?.groups.message
		};
	}
}
