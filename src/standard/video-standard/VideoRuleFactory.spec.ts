import { mock, MockProxy } from 'jest-mock-extended';

import { ConditionSerialised } from '../condition/ConditionSchema';
import { ICondition } from '../condition/ICondition';
import { IConditionFactory } from '../condition/IConditionFactory';
import { IVideoRuleFactory } from './IVideoRuleFactory';
import { VideoRule } from './VideoRule';
import { VideoRuleFactory } from './VideoRuleFactory';

describe('VideoRuleFactory', () => {
	let conditionFactoryMock: MockProxy<IConditionFactory>;
	let videoRuleFactory: IVideoRuleFactory;
	beforeEach(() => {
		conditionFactoryMock = mock<IConditionFactory>();
		videoRuleFactory = new VideoRuleFactory(conditionFactoryMock);
	});

	describe('create', () => {
		it('should return new Rule with 1 condition', () => {
			conditionFactoryMock.create
				.calledWith('condition1' as ConditionSerialised)
				.mockReturnValueOnce('Condition1' as unknown as ICondition);
			const result = videoRuleFactory.create({
				conditions: ['condition1' as ConditionSerialised]
			});
			expect(result).toBeInstanceOf(VideoRule);
			expect(result.conditions).toHaveLength(1);
		});
	});
});
