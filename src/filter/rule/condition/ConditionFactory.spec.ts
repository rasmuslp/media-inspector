import { Between } from './types/Between';
import { Equal } from './types/Equal';
import { GreaterThanOrEqual } from './types/GreaterThanOrEqual';
import { In } from './types/In';
import { LessThan } from './types/LessThan';
import { NotEqual } from './types/NotEqual';
import { ConditionFactory } from './ConditionFactory';
import { Operator } from './Operator';

describe('#getSharedInstanceFromSerialized', () => {
	test('identical conditions share the same ICondition', () => {
		// Conditions
		const conditionData1 = {
			path: 'p1',
			operator: Operator.GREATER_THAN_OR_EQUAL,
			value: 1
		};
		const conditionData2 = {
			path: 'p1',
			operator: Operator.GREATER_THAN_OR_EQUAL,
			value: 1
		};

		// Get Conditions
		const condition1 = ConditionFactory.getSharedInstanceFromSerialized(conditionData1);
		const condition2 = ConditionFactory.getSharedInstanceFromSerialized(conditionData2);

		expect(condition1).toBeInstanceOf(GreaterThanOrEqual);
		expect(condition2).toBeInstanceOf(GreaterThanOrEqual);

		expect(condition1).toBe(condition2);
	});
});

describe('#getFromSerialized', () => {
	it('returns Between', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'video.width',
			operator: Operator.BETWEEN,
			value: [640, 1279]
		});
		expect(result).toBeInstanceOf(Between);
	});

	it('returns Equal', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'video.format',
			operator: Operator.EQUAL,
			value: 'mpeg-4 visual'
		});
		expect(result).toBeInstanceOf(Equal);
	});

	it('returns GreaterThanOrEqual', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'video.width',
			operator: Operator.GREATER_THAN_OR_EQUAL,
			value: 1280
		});
		expect(result).toBeInstanceOf(GreaterThanOrEqual);
	});

	it('returns In', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'video.format',
			operator: Operator.IN,
			value: [
				'hevc',
				'avc',
				'vc-1'
			]
		});
		expect(result).toBeInstanceOf(In);
	});

	it('returns LessThan', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'general.bitrate',
			operator: Operator.LESS_THAN,
			value: 1_000_000
		});
		expect(result).toBeInstanceOf(LessThan);
	});

	it('returns NotEqual', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'video.scantype',
			operator: Operator.NOT_EQUAL,
			value: 'progressive'
		});
		expect(result).toBeInstanceOf(NotEqual);
	});
});
