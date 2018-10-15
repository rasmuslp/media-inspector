const fsTree = require('./fs-tree');
const mediainfo = require('./mediainfo');

const FilterRejectionError = require('./FilterRejectionError');

class MediaFile extends fsTree.File {
	constructor(objectPath, stats, type, mimeType) {
		super(objectPath, stats);

		// Mime type -part
		this._type = type;

		// Full mime type
		this._mimeType = mimeType;
	}

	get type() {
		return this._type;
	}

	get metadata() {
		return this._metadata;
	}

	async fetchMetadata() {
		this._metadata = await mediainfo.getMetadata(this.path);

		return this.metadata;
	}

	// Throws if not passing
	checkFilter(filter) {
		// All conditions must be met
		const output = [];
		for (const condition of filter) {
			const match = condition.path.match(/^([^.]+)\.([^.]+)$/);
			if (!match) {
				// Swallow: Could not parse filter? We count that as a pass
				console.error(`Could not parse path '${condition.path}' in filter:`, filter);
				continue;
			}

			const [, trackType, property] = match;

			// Try to read value
			let value;
			try {
				value = this.metadata.get(trackType, property);
			}
			catch (e) {
				// Swallow: Could not get property? Ee count that as a pass
				console.error(`Could not read ${condition.path} from ${this.path}`, e);
				continue;
			}

			// Test value
			switch (condition.comparator) {
				case 'string': {
					if (!(value.toLocaleLowerCase() === condition.value.toLocaleLowerCase())) {
						output.push({
							path: condition.path,
							condition: `${condition.comparator} ${condition.value.toLocaleLowerCase()}`,
							value: `${value.toLocaleLowerCase()}`
						});
					}

					break;
				}
				case '>=': {
					if (!(value >= condition.value)) {
						// We didn't meet the condition
						output.push({
							path: condition.path,
							condition: `${condition.comparator} ${condition.value}`,
							value
						});
					}

					break;
				}

				default:
					// Swallow: Unknown comparator? We count that as a pass
					console.error(`Unknown comparator '${condition.comparator}' in filter:`, filter);
					continue;
			}

			// No error at path
			output.push(null);
		}

		// Filter to remove any 'passed' entries, as they are stored as null
		if (output.filter(result => result).length > 0) {
			throw new FilterRejectionError(`Filter failed with reasons:`, this, output);
		}
	}

	// Throws if not passing any
	passAnyFilter(filters) {
		let rejections = [];
		for (const filter of filters) {
			try {
				this.checkFilter(filter);

				// If it's a pass, we return success
				return;
			}
			catch (e) {
				rejections.push(e);

				// Try next filter
			}
		}

		// Find rejected reason that satisfied file the most - i.e. closest to a pass
		let mostSatisfying;
		let score = 0;
		for (const rejection of rejections) {
			// Count passes before first failure
			let passesBeforeFirstFailure = 0;
			for (const reason of rejection.reasons) {
				if (reason) {
					break;
				}

				passesBeforeFirstFailure++;
			}

			if (passesBeforeFirstFailure > score) {
				mostSatisfying = rejection;
			}

			if (!mostSatisfying) {
				mostSatisfying = rejection;
			}
		}

		// Throw most satisfying, if any were found
		if (mostSatisfying) {
			throw mostSatisfying;
		}
	}

	// Include recommended
	async getPurges(options = {}) {
		if (this.type in options.filtersByType) {
			// Prime metadata for 'passAnyFilter'
			await this.fetchMetadata();

			try {
				this.passAnyFilter(options.filtersByType[this.type]);
				return [];
			}
			catch (e) {
				// Rejected

				if (options.includeRecommended) {
					// Take parent and all children when this was the majority
					if (this.size >= 0.9 * await this.parent.getSizeOfTree()) {
						// Mark parent and tree
						const parentTree = await this.parent.getTreeSorted();
						const purges = parentTree.map(node => ({
							fsObject: node,
							reason: this === node ? e : new fsTree.RecommendedPurgeError(`Auxiliary file or folder to ${this.path}`)
						}));

						return purges;
					}
				}

				return [{
					fsObject: this,
					reason: e
				}];
			}
		}

		return [];
	}
}

module.exports = MediaFile;
