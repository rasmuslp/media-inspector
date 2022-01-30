export interface Condition<T = unknown> {
	path: string;
	value: T;

	check(inputValue: number | string): boolean;

	toStringForValue(inputValue: number | string): string;
}
