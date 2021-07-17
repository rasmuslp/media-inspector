export class PathSorters {
	static childrenBeforeParents(a: string, b: string): number {
		if (a.startsWith(b)) {
			return -1;
		}
		else if (b.startsWith(a)) {
			return 1;
		}

		return a.localeCompare(b);
	}
}
