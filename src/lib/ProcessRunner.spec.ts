import { ProcessRunner } from './ProcessRunner';

describe('ProcessRunner', () => {
	it('can spawn process and read data from "all" stream', async () => {
		const callback = jest.fn();
		const runner = new ProcessRunner('echo', ['hello', 'there']);
		runner.all.on('data', (data: string) => void callback(data));

		await runner.promise();

		expect(callback).toBeCalledWith('hello there\n');
	});
});
