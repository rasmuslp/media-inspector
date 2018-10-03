const fsTree = require('./fs-tree');
const mediainfo = require('./mediainfo');

const FilterRejectionError = require('./FilterRejectionError');
const RecommendedPurgeError = require('./RecommendedPurgeError');

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
		this._metadata = await mediainfo.read(this.path);

		return this.metadata;
	}

	// Throws if not passing
	checkFilter(filter) {
		// All conditions must be met
		const rejectReasons = [];
		for (const [trackType, conditions] of Object.entries(filter)) {
			for (const [property, condition] of Object.entries(conditions)) {
				const value = this.metadata.get(trackType, property);
				switch (condition.comparator) {
					case 'string': {
						if (!(value.toLocaleLowerCase() === condition.value.toLocaleLowerCase())) {
							rejectReasons.push({
								path: `${trackType}.${property}`,
								condition: `${condition.comparator} ${condition.value.toLocaleLowerCase()}`,
								value: `${value.toLocaleLowerCase()}`
							});
						}

						break;
					}
					case '>=': {
						if (!(value >= condition.value)) {
							// We didn't meet the condition
							rejectReasons.push({
								path: `${trackType}.${property}`,
								condition: `${condition.comparator} ${condition.value}`,
								value
							});
						}

						break;
					}

					default:
						throw new Error(`Unknown comparator '${condition.comparator}'`);
				}
			}
		}

		if (rejectReasons.length > 0) {
			throw new FilterRejectionError(`Filter failed with reasons:`, this, rejectReasons);
		}
	}

	// Throws if not passing any
	passAnyFilter(filters) {
		let rejected;
		for (const filter of filters) {
			try {
				this.checkFilter(filter);

				// If it's a pass, we return success
				return;
			}
			catch (e) {
				// Rejected, store and try next filter
				rejected = e;
			}
		}

		throw rejected;
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
							reason: this === node ? e : new RecommendedPurgeError(`Auxiliary file or folder to ${this.path}`)
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
