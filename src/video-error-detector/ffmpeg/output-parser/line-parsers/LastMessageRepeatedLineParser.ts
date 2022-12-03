import { LineParser } from './LineParser';

export interface ParsedLastMessageRepeatedLine {
	count: number;
}

export class LastMessageRepeatedLineParser implements LineParser<ParsedLastMessageRepeatedLine> {
	static lineMatcher = /Last message repeated (?<count>\d+) time/;

	canParse(line: string): boolean {
		return LastMessageRepeatedLineParser.lineMatcher.test(line);
	}

	parse(line: string): ParsedLastMessageRepeatedLine {
		const result = LastMessageRepeatedLineParser.lineMatcher.exec(line);
		return {
			count: Number.parseInt(result?.groups.count, 10)
		};
	}
}
