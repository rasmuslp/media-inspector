export function quoteIfNotNumber(input: number | string): string {
	const result = typeof input === 'number' ? input.toString() : `'${input}'`;
	return result;
}
