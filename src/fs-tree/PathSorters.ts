export class PathSorters {
	static childrenBeforeParents(a: string, b: string): number {
		if (a.startsWith(b)) {
			return -1;
		}
		if (b.startsWith(a)) {
			return 1;
		}

		return a.localeCompare(b);
	}

	static parentsBeforeChildren(a: string, b: string): number {
		return a.localeCompare(b);
	}
}
