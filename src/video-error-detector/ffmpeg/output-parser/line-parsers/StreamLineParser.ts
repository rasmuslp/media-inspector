import { LineParser } from './LineParser';

export interface ParsedStreamLine {
	type: string;
	message: string;
}

export class StreamLineParser implements LineParser<ParsedStreamLine> {
	static lineMatcher = /\[(?<type>.*)\s@\s.*]\s(?<message>.*)/;

	canParse(line: string): boolean {
		return StreamLineParser.lineMatcher.test(line);
	}

	parse(line: string): ParsedStreamLine {
		const result = StreamLineParser.lineMatcher.exec(line);
		return {
			type: result?.groups.type,
			message: result?.groups.message
		};
	}
}
