export interface LineParser<T> {
	canParse(line: string): boolean
	parse(line: string): T
}
