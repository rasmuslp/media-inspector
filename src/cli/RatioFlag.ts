import { Flags } from '@oclif/core';

export const RatioFlag = Flags.custom({
	parse: async input => {
		// Matches [0, 1], with dot and comma separator
		const ratioRegex = /^(((0[,.])?\d+)|1)$/;
		if (!ratioRegex.test(input)) {
			throw new Error(`Expected a ratio between 0 and 1 but received: ${input}`);
		}

		return Number.parseFloat(input);
	}
});
