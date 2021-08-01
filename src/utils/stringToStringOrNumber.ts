export function stringToStringOrNumber(input: string): number|string {
	if (!Number.isNaN(Number(input))) {
		return Number(input);
	}

	return input.toLocaleLowerCase();
}
