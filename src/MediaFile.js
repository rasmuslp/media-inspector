const fsTree = require('./fs-tree');
const mediainfo = require('./mediainfo');

const FilterRejectionError = require('./FilterRejectionError');

class MediaFile extends fsTree.File {
	constructor(objectPath, stats, type, mimeType) {
		super(objectPath, stats);

		this._type = type;
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

	async getPruneList({ filtersByType }) {
		const pruneList = [];

		if (this.type in filtersByType) {
			// Prime metadata for 'passAnyFilter'
			await this.fetchMetadata();

			try {
				this.passAnyFilter(filtersByType[this.type]);
				return [];
			}
			catch (e) {
				// Rejected
				return [{
					fsObject: this,
					reason: e
				}];
			}
		}

		return pruneList;
	}
}

module.exports = MediaFile;
