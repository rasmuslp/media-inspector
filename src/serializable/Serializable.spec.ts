import * as t from 'io-ts';

import { Serializable, TSerializable } from './Serializable';

const TSimpleSerializablePartial = t.type({
	someConstructorData: t.string
});
const TSimpleSerializable = t.intersection([TSerializable, TSimpleSerializablePartial]);
type SimpleSerializableData = t.TypeOf<typeof TSimpleSerializable>;
class SimpleSerializable extends Serializable<SimpleSerializableData> {}

const TAdvancedSerializablePartial = t.type({
	someConstructorData: t.string,
	someAdditionalData: t.string
});
const TAdvancedSerializable = t.intersection([TSerializable, TAdvancedSerializablePartial]);
type AdvancedSerializableData = t.TypeOf<typeof TAdvancedSerializable>;
class AdvancedSerializable extends Serializable<AdvancedSerializableData> {
	getDataForSerialization(): Partial<AdvancedSerializableData> {
		return {
			someAdditionalData: 'more data'
		};
	}
}

describe('Serializable', () => {
	describe('SimpleSerializable', () => {
		let serializable: SimpleSerializable;
		beforeEach(() => {
			serializable = new SimpleSerializable({
				someConstructorData: 'a'
			});
		});

		it('.getDataForSerialization is not overridden and returns void', () => {
			const result = serializable.getDataForSerialization();
			expect(result).toEqual({});
		});

		it('.serialize returns all relevant data for serialization', () => {
			const result = serializable.serialize();
			expect(result).toEqual({
				someConstructorData: 'a',
				type: 'SimpleSerializable'
			});
		});
	});

	describe('AdvancedSerializable', () => {
		let serializable: AdvancedSerializable;
		beforeEach(() => {
			serializable = new AdvancedSerializable({
				someConstructorData: 'a'
			});
		});

		it('.getDataForSerialization is overridden and returns data for serialization', () => {
			const result = serializable.getDataForSerialization();
			expect(result).toEqual({
				someAdditionalData: 'more data'
			});
		});

		it('.serialize returns all relevant data for serialization', () => {
			const result = serializable.serialize();
			expect(result).toEqual({
				someConstructorData: 'a',
				someAdditionalData: 'more data',
				type: 'AdvancedSerializable'
			});
		});
	});
});
