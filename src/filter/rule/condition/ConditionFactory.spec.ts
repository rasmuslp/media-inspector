import { OperatorGreaterThanOrEqual } from './operator/OperatorGreaterThanOrEqual';
import { OperatorBetween } from './operator/OperatorBetween';
import { OperatorEqual } from './operator/OperatorEqual';
import { OperatorIn } from './operator/OperatorIn';
import { OperatorLessThan } from './operator/OperatorLessThan';
import { OperatorNotEqual } from './operator/OperatorNotEqual';
import { ConditionFactory } from './ConditionFactory';
import { OperatorType } from './OperatorType';

describe('#getSharedInstanceFromSerialized', () => {
	test('identical conditions share the same Condition', () => {
		// Conditions
		const conditionData1 = {
			path: 'p1',
			operator: OperatorType.GREATER_THAN_OR_EQUAL,
			value: 1
		};
		const conditionData2 = {
			path: 'p1',
			operator: OperatorType.GREATER_THAN_OR_EQUAL,
			value: 1
		};

		// Get Conditions
		const condition1 = ConditionFactory.getSharedInstanceFromSerialized(conditionData1);
		const condition2 = ConditionFactory.getSharedInstanceFromSerialized(conditionData2);

		expect(condition1).toBeInstanceOf(OperatorGreaterThanOrEqual);
		expect(condition2).toBeInstanceOf(OperatorGreaterThanOrEqual);

		expect(condition1).toBe(condition2);
	});
});

describe('#getFromSerialized', () => {
	it('returns OperatorBetween', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'video.width',
			operator: OperatorType.BETWEEN,
			value: [640, 1279]
		});
		expect(result).toBeInstanceOf(OperatorBetween);
	});

	it('returns OperatorEqual', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'video.format',
			operator: OperatorType.EQUAL,
			value: 'mpeg-4 visual'
		});
		expect(result).toBeInstanceOf(OperatorEqual);
	});

	it('returns OperatorGreaterThanOrEqual', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'video.width',
			operator: OperatorType.GREATER_THAN_OR_EQUAL,
			value: 1280
		});
		expect(result).toBeInstanceOf(OperatorGreaterThanOrEqual);
	});

	it('returns OperatorIn', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'video.format',
			operator: OperatorType.IN,
			value: [
				'hevc',
				'avc',
				'vc-1'
			]
		});
		expect(result).toBeInstanceOf(OperatorIn);
	});

	it('returns OperatorLessThan', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'general.bitrate',
			operator: OperatorType.LESS_THAN,
			value: 1_000_000
		});
		expect(result).toBeInstanceOf(OperatorLessThan);
	});

	it('returns OperatorNotEqual', () => {
		const result = ConditionFactory.getFromSerialized({
			path: 'video.scantype',
			operator: OperatorType.NOT_EQUAL,
			value: 'progressive'
		});
		expect(result).toBeInstanceOf(OperatorNotEqual);
	});
});
