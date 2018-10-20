const debug = require('debug')('MediaFile');

const fsTree = require('./fs-tree');
const mediainfo = require('./mediainfo');

const FilterResult = require('./filter/FilterResult');
const FilterRejectionPurge = require('./filter/FilterRejectionPurge');

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

	checkFilter(filter) {
		// All conditions must be met
		const results = [];
		for (const filterCondition of filter) {
			const [trackType, property] = filterCondition.pathParts;

			// Try to read value
			let value;
			try {
				value = this.metadata.get(trackType, property);
			}
			catch (e) {
				// Swallow: Could not get property? Ee count that as a pass
				debug(`Could not read ${filterCondition.path} from ${this.path}`, e.message || e);
				continue;
			}

			// Check and store
			const filterConditionResult = filterCondition.check(value);
			results.push(filterConditionResult);
		}

		return new FilterResult(results);
	}

	// Returns false if passed, Purge if rejected
	isRejected(filters = []) {
		// No filters, thats a pass
		if (filters.length === 0) {
			return false;
		}

		// Check all filters
		let results = [];
		for (const filter of filters) {
			const result = this.checkFilter(filter);
			results.push(result);
		}

		// See if any passed
		const anyPassed = results.find(result => result.passed);
		if (anyPassed) {
			return false;
		}

		// Otherwise reject
		return new FilterRejectionPurge(`Filters failed with::`, this, results);
	}

	// Include recommended
	async getPurges(options = {}) {
		if (this.type in options.filtersByType) {
			// Prime metadata for 'isRejected'
			await this.fetchMetadata();

			const rejected = this.isRejected(options.filtersByType[this.type]);
			if (!rejected) {
				return [];
			}

			// Rejected
			if (options.includeRecommended) {
				// Take parent and all children when this was the majority
				if (this.size >= 0.9 * await this.parent.getSizeOfTree()) {
					// Mark parent and tree
					const parentTree = await this.parent.getTreeSorted();
					const purges = parentTree.map(node => ({
						fsObject: node,
						reason: this === node ? rejected : new fsTree.RecommendedPurge(`Auxiliary file or folder to ${this.path}`)
					}));

					return purges;
				}
			}

			return [{
				fsObject: this,
				reason: rejected
			}];
		}

		return [];
	}
}

module.exports = MediaFile;
