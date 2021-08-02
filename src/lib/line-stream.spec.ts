/* eslint-disable jest/no-done-callback */
/* eslint-disable jest/expect-expect */

import { Transform } from 'stream';
import { lineStream } from './line-stream';
import DoneCallback = jest.DoneCallback;

function lineStreamTester(expectedLines: string[], done: DoneCallback): Transform {
	const stream = lineStream();
	const lines = [];

	stream.on('data', line => {
		lines.push(line);
	});

	stream.on('end', () => {
		expect(lines).toEqual(expectedLines);
		done();
	});

	return stream;
}

describe('line-stream', () => {
	describe('handles \\n', () => {
		it('should handle newline over multiple writes (1)', done => {
			const stream = lineStreamTester([
				'12',
				'34'
			], done);

			stream.write('12\n');
			stream.write('34');

			stream.end();
		});

		it('should handle newline over multiple writes (2)', done => {
			const stream = lineStreamTester([
				'12',
				'34'
			], done);

			stream.write('12');
			stream.write('\n34');

			stream.end();
		});

		it('should handle newline on end', done => {
			const stream = lineStreamTester([
				'12',
				'34'
			], done);

			stream.end('12\n34');
		});
	});

	describe('handles \\r', () => {
		it('should handle caret return over multiple writes (1)', done => {
			const stream = lineStreamTester([
				'12',
				'34'
			], done);

			stream.write('12\r');
			stream.write('34');

			stream.end();
		});

		it('should handle caret return over multiple writes (2)', done => {
			const stream = lineStreamTester([
				'12',
				'34'
			], done);

			stream.write('12');
			stream.write('\r34');

			stream.end();
		});

		it('should handle caret return on end', done => {
			const stream = lineStreamTester([
				'12',
				'34'
			], done);

			stream.end('12\r34');
		});
	});

	describe('handles \\r\\n', () => {
		it('should handle caret return and newline over multiple writes (1)', done => {
			const stream = lineStreamTester([
				'12',
				'34'
			], done);

			stream.write('12\r\n');
			stream.write('34');

			stream.end();
		});

		it('should handle caret return and newline over multiple writes (2)', done => {
			const stream = lineStreamTester([
				'12',
				'34'
			], done);

			stream.write('12');
			stream.write('\r\n34');

			stream.end();
		});

		it('should handle caret return and newline over multiple writes (3)', done => {
			const stream = lineStreamTester([
				'12',
				'',
				'34'
			], done);

			stream.write('12\r');
			stream.write('\n34');

			stream.end();
		});

		it('should handle caret return and newline on end', done => {
			const stream = lineStreamTester([
				'12',
				'34'
			], done);

			stream.end('12\r\n34');
		});
	});
});
