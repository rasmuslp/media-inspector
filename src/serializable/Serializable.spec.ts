import { z } from 'zod';

import { Serializable } from './Serializable';

const TestSerializableSchema = z.object({
	someData: z.string()
});
type TestSerializableSerialized = z.infer<typeof TestSerializableSchema>;

// eslint-disable-next-line jest/no-export
export class TestSerializable extends Serializable<TestSerializableSerialized> {
	private someData: string;

	constructor(someData: string) {
		super();
		this.someData = someData;
	}

	getDataForSerialization(): TestSerializableSerialized {
		return {
			someData: this.someData
		};
	}
}

describe('Serializable', () => {
	describe('TestSerializable', () => {
		let testSerializable: TestSerializable;
		beforeEach(() => {
			testSerializable = new TestSerializable('here is data');
		});

		it('.getDataForSerialization returns TestSerializableSerialized', () => {
			const result = testSerializable.getDataForSerialization();
			expect(result).toEqual({
				someData: 'here is data'
			});
		});

		it('.serialize returns all relevant data for serialization', () => {
			const result = testSerializable.serialize();
			expect(result).toEqual({
				type: 'TestSerializable',
				data: {
					someData: 'here is data'
				}
			});
		});
	});
});
