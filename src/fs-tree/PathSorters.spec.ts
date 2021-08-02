import { PathSorters } from './PathSorters';

describe('PathSorters', () => {
	let unsortedPaths: string[];
	beforeEach(() => {
		unsortedPaths = [
			'/b/path/file.ext',
			'/b/path/file2.ext',
			'/a/path/',
			'/b/path/file2.1xt',
			'/a/path/aFolder',
			'/',
			'/a/path/file.ext',
			'/a/path/aFolder/someFile.ext',
			'/b/',
			'/b/path/',
			'/a/path/aFolder/someFileOtherFile',
			'/a/',
			'/a/path/aaa.bbb',
			'/b/path/file1.ext'
		];
	});

	describe('childrenBeforeParents()', () => {
		it('sorts children before parents', () => {
			const sortedPaths = [...unsortedPaths].sort((a, b) => PathSorters.childrenBeforeParents(a, b));
			expect(sortedPaths).toEqual([
				'/a/path/aaa.bbb',
				'/a/path/aFolder/someFile.ext',
				'/a/path/aFolder/someFileOtherFile',
				'/a/path/aFolder',
				'/a/path/file.ext',
				'/a/path/',
				'/a/',
				'/b/path/file.ext',
				'/b/path/file1.ext',
				'/b/path/file2.1xt',
				'/b/path/file2.ext',
				'/b/path/',
				'/b/',
				'/'
			]);
		});
	});

	describe('parentsBeforeChildren()', () => {
		it('sorts parents before children', () => {
			const sortedPaths = [...unsortedPaths].sort((a, b) => PathSorters.parentsBeforeChildren(a, b));
			expect(sortedPaths).toEqual([
				'/',
				'/a/',
				'/a/path/',
				'/a/path/aaa.bbb',
				'/a/path/aFolder',
				'/a/path/aFolder/someFile.ext',
				'/a/path/aFolder/someFileOtherFile',
				'/a/path/file.ext',
				'/b/',
				'/b/path/',
				'/b/path/file.ext',
				'/b/path/file1.ext',
				'/b/path/file2.1xt',
				'/b/path/file2.ext'
			]);
		});
	});
});
