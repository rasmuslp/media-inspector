import { PathSorters } from './PathSorters';

describe('childrenBeforeParents', () => {
	it('sorts children before parents', () => {
		const paths = [
			'/b/path/file.ext',
			'/b/path/file2.ext',
			'/a/path',
			'/b/path/file2.1xt',
			'/a/path/file.ext',
			'/b/path/file1.ext'
		];
		const result = paths.sort(PathSorters.childrenBeforeParents.bind(PathSorters));
		expect(result).toEqual([
			'/a/path/file.ext',
			'/a/path',
			'/b/path/file.ext',
			'/b/path/file1.ext',
			'/b/path/file2.1xt',
			'/b/path/file2.ext'
		]);
	});
});
