import { z } from 'zod';

import { Serializable, SerializableSchema } from './Serializable';

const SimpleSerializableSchema = SerializableSchema.extend({
	someConstructorData: z.string()
});
type SimpleSerializableData = z.infer<typeof SimpleSerializableSchema>;

// eslint-disable-next-line jest/no-export
export class SimpleSerializable extends Serializable<SimpleSerializableData> {}

const AdvancedSerializableDataSchema = SerializableSchema.extend({
	someConstructorData: z.string(),
	someAdditionalData: z.string()
});
type AdvancedSerializableData = z.infer<typeof AdvancedSerializableDataSchema>;

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
				type: 'SimpleSerializable',
				someConstructorData: 'a'
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
				type: 'AdvancedSerializable',
				someConstructorData: 'a',
				someAdditionalData: 'more data'
			});
		});
	});
});
