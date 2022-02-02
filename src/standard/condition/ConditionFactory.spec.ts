import { Between } from './types/Between';
import { Equal } from './types/Equal';
import { GreaterThanOrEqual } from './types/GreaterThanOrEqual';
import { In } from './types/In';
import { LessThan } from './types/LessThan';
import { NotEqual } from './types/NotEqual';
import { ConditionFactory } from './ConditionFactory';
import { IConditionFactory } from './IConditionFactory';
import { Operator } from './Operator';

describe('ConditionFactory', () => {
	let conditionFactory: IConditionFactory;
	beforeEach(() => {
		conditionFactory = new ConditionFactory();
	});

	describe('create', () => {
		it('returns Between', () => {
			const result = conditionFactory.create({
				path: 'video.width',
				operator: Operator.BETWEEN,
				value: [640, 1279]
			});
			expect(result).toBeInstanceOf(Between);
		});

		it('returns Equal', () => {
			const result = conditionFactory.create({
				path: 'video.format',
				operator: Operator.EQUAL,
				value: 'mpeg-4 visual'
			});
			expect(result).toBeInstanceOf(Equal);
		});

		it('returns GreaterThanOrEqual', () => {
			const result = conditionFactory.create({
				path: 'video.width',
				operator: Operator.GREATER_THAN_OR_EQUAL,
				value: 1280
			});
			expect(result).toBeInstanceOf(GreaterThanOrEqual);
		});

		it('returns In', () => {
			const result = conditionFactory.create({
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
			const result = conditionFactory.create({
				path: 'general.bitrate',
				operator: Operator.LESS_THAN,
				value: 1_000_000
			});
			expect(result).toBeInstanceOf(LessThan);
		});

		it('returns NotEqual', () => {
			const result = conditionFactory.create({
				path: 'video.scantype',
				operator: Operator.NOT_EQUAL,
				value: 'progressive'
			});
			expect(result).toBeInstanceOf(NotEqual);
		});
	});
});
