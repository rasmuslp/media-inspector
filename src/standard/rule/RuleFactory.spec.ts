import { mock, MockProxy } from 'jest-mock-extended';

import { ConditionSerialised } from '../condition/ConditionSchema';
import { ICondition } from '../condition/ICondition';
import { IConditionFactory } from '../condition/IConditionFactory';
import { IRuleFactory } from './IRuleFactory';
import { Rule } from './Rule';
import { RuleFactory } from './RuleFactory';

describe('RuleFactory', () => {
	let conditionFactoryMock: MockProxy<IConditionFactory>;
	let ruleFactory: IRuleFactory;
	beforeEach(() => {
		conditionFactoryMock = mock<IConditionFactory>();
		ruleFactory = new RuleFactory(conditionFactoryMock);
	});

	describe('create', () => {
		it('should return new Rule with 1 condition', () => {
			conditionFactoryMock.create
				.calledWith('condition1' as ConditionSerialised)
				.mockReturnValueOnce('Condition1' as unknown as ICondition);
			const result = ruleFactory.create({
				conditions: ['condition1' as ConditionSerialised]
			});
			expect(result).toBeInstanceOf(Rule);
			expect(result.conditions).toHaveLength(1);
		});
	});
});
