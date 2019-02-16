import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';

// Credit: https://www.olioapps.com/blog/checking-types-real-world-typescript/
// Apply a validator and get the result in a `Promise`
export function decodeToPromise<T, O, I>(
	validator: t.Type<T, O, I>,
	input: I
): Promise<T> {
	const result = validator.decode(input);
	return result.fold(
		errors => {
			const messages = reporter(result);
			return Promise.reject(new Error(messages.join('\n')));
		},
		value => Promise.resolve(value)
	);
}

export function decodeTo<T, O, I>(
	validator: t.Type<T, O, I>,
	input: I
): T {
	const result = validator.decode(input);
	if (result.isRight()) {
		return result.value;
	}

	const messages = reporter(result);
	throw new Error(messages.join('\n'));
}
